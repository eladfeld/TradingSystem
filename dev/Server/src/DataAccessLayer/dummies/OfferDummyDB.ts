import { Offer } from "../../DomainLayer/offer/Offer";
import { iOfferDB } from "../interfaces/iOfferDB";

export class OfferDummyDB implements iOfferDB
{
    private offers: Offer[];

    public constructor(){
        this.offers = []
    }

    getAllOffersByUser: (storeId: number) => Promise<Offer[]>;

    getAllOffersByStore: (storeId: number) => Promise<Offer[]>;

    updateOffer(offer: Offer): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getOfferById(offerId: number): Promise<Offer> {
        throw new Error("Method not implemented.");
    }

    public addOffer(offer: Offer): Promise<number>{
        this.offers.push(offer);
        return Promise.resolve(offer.getOfferId());
    }

}