import { Offer } from "../../DomainLayer/offer/Offer";

export interface iOfferDB
{
    updateOffer(offer: Offer): Promise<void>;

    getOfferById(offerId: number): Promise<Offer>;

    addOffer:(offer: Offer)=> Promise<number>;

}