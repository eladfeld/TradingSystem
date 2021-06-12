import { Offer } from "../../DomainLayer/offer/Offer";
import { sequelize } from "../connectDb";
import { iOfferDB } from "../interfaces/iOfferDB";

export class offerDB implements iOfferDB
{

    public async getOfferById(offerId: number): Promise<Offer> {
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
                    offerdb.productId,
                    offerdb.productName,
                    offerdb.offerPrice,
                    offerdb.counterPrice,
                    offerdb.offerStatus,
                    offerdb.ownersAccepted.split`,`.map(Number),
                )
                return Promise.resolve(offer);
            }
        }
        catch(e)
        {
            return Promise.reject("could not fetch offer from database")
        }
        return Promise.resolve(undefined);
    }

    public async addOffer(offer: Offer): Promise<number>
    {
        try{
            await sequelize.models.Offer.create({
                id: offer.getOfferId(),
                SubscriberId: offer.getUserId(),
                username: offer.getUsername(),
                StoreId: offer.getStoreId(),
                productId: offer.getProductId(),
                productName: offer.getProductName(),
                offerPrice: offer.getOfferPrice(),
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
        await sequelize.models.Offer.update(
            {
                offerPrice: offer.getOfferPrice(),
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


}