import { iOfferManager } from './iOfferManager'
import { Offer } from './Offer';
import { DB } from "../../DataAccessLayer/DBfacade";
import { Subscriber } from '../user/Subscriber';
import { StoreProduct } from '../store/StoreProduct';
import { Store } from '../store/Store';
import { Logger } from '../../Logger';

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

    declineOffer: (userid: number, storeId: number, offerId: number) => Promise<void>;
    counterOffer: (userid: number, storeId: number, offerId: number, counterPrice: number) => Promise<void>;
    sendOfferAlertToOwners: (storeId: number, offerId: number) => Promise<void>;
    sendOfferAlertToBuyer: (userId: number, offerId: number) => Promise<void>;
    sendRecievedSupplyAlertToBuyer: (userId: number, offerId: number) => Promise<void>;
    getOffersByStore: (storeId: number) => Promise<Offer[]>;
    getOffersByUser: (userId: number) => Promise<Offer[]>;
    getAcceptedOffersByUser: (userId: number) => Promise<Offer[]>;
    reserveAcceptedOffersByUser: (userId: number) => Promise<void>;
    clearAcceptedOffersByUser: (userId: number) => Promise<Offer[]>;
    removeAcceptedOffer: (offerId: number) => Promise<void>;


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

    public async newOffer(user: Subscriber, storeId: number, product: StoreProduct, offerPrice: number): Promise<number>{
        return Offer.createOffer(user.getUserId(), user.getUsername(), storeId, product.getProductId(), product.getName(), offerPrice)
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
                        resolve(DB.updateOffer(offerFromDb))
                    }
                    Logger.log(`could not change offer status to accepted`)
                }
                resolve()
            }).catch(err => reject(err));
        })

    }





}