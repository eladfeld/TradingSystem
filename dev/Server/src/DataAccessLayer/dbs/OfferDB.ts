import { Offer } from "../../DomainLayer/offer/Offer";
import { sequelize } from "../connectDb";
import { iOfferDB } from "../interfaces/iOfferDB";

export class offerDB implements iOfferDB
{

    public async getOfferById(offerId: number): Promise<Offer> 
    {
        try{
            let offerdb = await sequelize.models.Offer.findOne(
                {
                    where:
                    {
                        id: offerId
                    }
                }
            )
            if(offerdb !== null && offerdb != [] && offerdb !== undefined)
            {
                let offer = Offer.rebuildOffer(
                    offerdb.id,
                    offerdb.SubscriberId,
                    offerdb.username,
                    offerdb.StoreId,
                    offerdb.StoreProductId,
                    offerdb.productName,
                    offerdb.bid,
                    offerdb.counterPrice,
                    offerdb.offerStatus,
                    offerdb.ownersAccepted.split`,`.map(Number),
                )
                return Promise.resolve(offer);
            }
        return Promise.resolve(undefined);
        }
        catch{
            return Promise.reject("database error try again later")
        }
    }

    public async addOffer(offer: Offer): Promise<number>
    {
        try{
            await sequelize.models.Offer.create({
                id: offer.getOfferId(),
                SubscriberId: offer.getUserId(),
                username: offer.getUsername(),
                StoreId: offer.getStoreId(),
                StoreProductId: offer.getProductId(),
                productName: offer.getProductName(),
                bid: offer.getBid(),
                counterPrice: offer.getCounterPrice(),
                offerStatus: offer.getOfferStatus(),
                ownersAccepted: offer.getOwnersAccepted().join(','),
            })
            return Promise.resolve(offer.getOfferId());
        }
        catch(e)
        {
            return Promise.reject("offer with the same id exists")
        }
    }

    public async updateOffer(offer: Offer): Promise<void>{
        try{
            await sequelize.models.Offer.update(
                {
                    bid: offer.getBid(),
                    counterPrice: offer.getCounterPrice(),
                    offerStatus: offer.getOfferStatus(),
                    ownersAccepted: offer.getOwnersAccepted().join(','),
                },
                {
                    where:
                    {
                        id: offer.getOfferId(),
                    }
                } )
            return Promise.resolve()
        }
        catch(e)
        {
            return Promise.reject("database error, please try again later")
        }

    }

    public async getAllOffersByStore(storeId: number):Promise<Offer[]>
    {
        try{
            
            let offerssdb = await sequelize.models.Offer.findAll(
                {
                    where:
                    {
                        storeId: storeId
                    }
                }
            )
        let offers = []
        for(let offerdb of offerssdb)
        {
            offers.push(Offer.rebuildOffer(
                offerdb.id,
                offerdb.SubscriberId,
                offerdb.username,
                offerdb.StoreId,
                offerdb.StoreProductId,
                offerdb.productName,
                offerdb.bid,
                offerdb.counterPrice,
                offerdb.offerStatus,
                offerdb.ownersAccepted.split`,`.map(Number),
            ));
        }
        return Promise.resolve(offers);
    }
    catch{
        return Promise.reject("database error, please try again later")
        }
    }

    public async getAllOffersByUser(userId: number):Promise<Offer[]>
    {
        try{
            let offerssdb = await sequelize.models.Offer.findAll(
                {
                    where:
                    {
                        SubscriberId: userId
                    }
                }
            )
    
            let offers = []
            for(let offerdb of offerssdb)
            {
                offers.push(Offer.rebuildOffer(
                    offerdb.id,
                    offerdb.SubscriberId,
                    offerdb.username,
                    offerdb.StoreId,
                    offerdb.StoreProductId,
                    offerdb.productName,
                    offerdb.bid,
                    offerdb.counterPrice,
                    offerdb.offerStatus,
                    offerdb.ownersAccepted.split`,`.map(Number),
                ));
            }
            return Promise.resolve(offers);
        }
        catch(e)
        {
            return Promise.reject("database error, please try again later")
        }

    }


}