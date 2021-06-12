import { iOfferManager } from './iOfferManager'
import { Offer, OfferStatus } from './Offer';
import { DB } from "../../DataAccessLayer/DBfacade";
import { Subscriber } from '../user/Subscriber';
import { StoreProduct } from '../store/StoreProduct';
import { Store } from '../store/Store';
import { Logger } from '../../Logger';
import { Publisher } from '../notifications/Publisher';
import { isOk } from '../../Result';
import Purchase from '../purchase/Purchase';

export class OfferManager implements iOfferManager {

    private static singletone: OfferManager = undefined;

    public static get_instance() : OfferManager
    {
        if (OfferManager.singletone === undefined)
        {
            OfferManager.singletone = new OfferManager();
        }
        return OfferManager.singletone;
    }

    sendOfferAlertToOwners: (storeId: number, offerId: number) => Promise<void>;
    sendRecievedSupplyAlertToBuyer: (subscriber: Subscriber, offer: Offer) => Promise<void>;

    getUserOfferPrice: () => number;
    getProductPrice: () => number;

    public async setStoreToRecieveOffers(storeId: number): Promise<void> {
        await DB.updateStoreRecievesOffers(storeId, true);
    }

    public async setStoreToNotRecieveOffers(storeId: number): Promise<void> {
        await DB.updateStoreRecievesOffers(storeId, false);
    }

    public async isRecievingOffers(storeId: number): Promise<boolean> {
        return DB.getRecievingOffers(storeId);
    }

    public async newOffer(user: Subscriber, storeId: number, product: StoreProduct, bid: number): Promise<number>{
        Publisher.get_instance().notify_store_update(storeId, `you recieved a new offer for ${product.getName()} from ${user.getUsername()}`)
        return Offer.createOffer(user.getUserId(), user.getUsername(), storeId, product.getProductId(), product.getName(), bid)
    }

    public async acceptOffer(subscriber: Subscriber, store: Store, offerId: number): Promise<void>{
        if (!subscriber.isOwner(store.getStoreId())){
            return Promise.reject('subscriber cant accept offer, is not owner of store')
        }
        let offerp = DB.getOfferById(offerId);
        let ownersAccepted: number[] = []
        let offerFromDb: Offer;
        return new Promise((resolve,reject) => {
            offerp.then(offer => {
                offerFromDb = offer
                ownersAccepted = offer.acceptOffer(subscriber.getUserId());
                let storeApps = store.getAppointments()
                return Promise.all(storeApps.map(app => DB.getSubscriberById(app.appointee)))
            }).then(appointees => {
                let storeOwners = appointees.filter(appointee => appointee.isOwner(store.getStoreId()));
                let diff = storeOwners.filter(x => !ownersAccepted.includes(x.getUserId()));
                Logger.log(`owners yet to accept ${JSON.stringify(diff)}`)
                if(diff.length == 0){
                    if(offerFromDb.changeStatusToAccepted()){
                        Logger.log(`Offer status changed to accepted`)
                        resolve(DB.updateOffer(offerFromDb).then(() => this.sendOfferAlertToBuyer(subscriber, offerFromDb)))
                    }
                    Logger.log(`could not change offer status to accepted`)
                }
                resolve()
            }).catch(err => reject(err));
        })

    }


    public async declineOffer(subscriber: Subscriber, store: Store, offerId: number): Promise<void>{
        if (!subscriber.isOwner(store.getStoreId())){
            return Promise.reject('subscriber cant decline offer, is not owner of store')
        }
        let offerp = DB.getOfferById(offerId);
        return new Promise((resolve,reject) => {
            offerp.then(offer => {
                if(offer.changeStatusToDecline()){
                    Logger.log(`Offer status changed to declined`)
                    resolve(DB.updateOffer(offer).then(() => this.sendOfferAlertToBuyer(subscriber, offer)))
                }
            })
        })

    }

    public async counterOffer(subscriber: Subscriber, store: Store, offerId: number, counterPrice: number): Promise<void>{
        if (!subscriber.isOwner(store.getStoreId())){
            return Promise.reject('subscriber cant counter offer, is not owner of store')
        }
        let offerp = DB.getOfferById(offerId);
        return new Promise((resolve,reject) => {
            offerp.then(offer => {
                if(offer.changeStatusToCounter(counterPrice)){
                    Logger.log(`Offer status changed to counter`)
                    resolve(DB.updateOffer(offer).then(() => this.sendOfferAlertToBuyer(subscriber, offer)))
                }
            }).catch(err => reject(err))
        })

    }


    public async getOffersByStore (storeId: number) : Promise<Offer[]>{
        return DB.getAllOffersByStore(storeId);
    }

    public async getOffersByUser (userId: number) : Promise<Offer[]>{
        return DB.getAllOffersByUser(userId);
    }

    public async sendOfferAlertToBuyer(subscriber: Subscriber, offer: Offer): Promise<void> {
        let message = ''
        switch (offer.getOfferStatus()){
            case OfferStatus.ACCEPTED:
                message = `your offer for ${offer.getProductName()} has been accepted`
                break;
            case OfferStatus.ACCEPTED_AND_SOLD_OUT:
                message = `your offer for ${offer.getProductName()} has been accepted but is sold out`
                break;
            case OfferStatus.COUNTER:
                message = `you have recieved a counter offer for ${offer.getProductName()}`
                break;
            case OfferStatus.DECLINED:
                message = `your offer for ${offer.getProductName()} has been declined`
                break;
        }
        Publisher.get_instance().send_message(subscriber, message);

    }

    public async buyAcceptedOffer(subscriber: Subscriber, store: Store, offerId: number, onFail : ()=>void): Promise<boolean> {
        if(store.getIsStoreClosed()){
            return Promise.reject("Store is closed")
        }
        let reservedProducts = new Map <number, [number,string,number]> (); // id => [quantity, name, price]
        let pricesToQuantity = new Map <number, number> ();
        let offerp = DB.getOfferById(offerId);
        return new Promise((resolve,reject) => {
            offerp.then(offer => {
            let pid = offer.getProductId();
            let quantity = 1
            let sellResult = store.reserveProduct(pid, quantity);
            let productPrice = offer.getBid();
            if(offer.getCounterPrice() > 0)
                productPrice = offer.getCounterPrice();
            let pname = offer.getProductName();
            if(isOk(sellResult) && sellResult.value && productPrice != -1){
                reservedProducts.set(pid,[quantity,pname,productPrice]);
                pricesToQuantity.set(productPrice,quantity);
            }
            else{
                store.cancelReservedShoppingBasket(reservedProducts)
                return Promise.reject(sellResult);
            }

            Purchase.checkout(store.getStoreId(), productPrice, subscriber.getUserId(), reservedProducts, store.getStoreName(),() => {
                onFail();
                store.cancelReservedShoppingBasket(reservedProducts)}
            );
            return resolve(true);
            }).catch(err => reject(err))
        })
    }


}