import { Offer } from "../../DomainLayer/offer/Offer";

export interface iOfferDB
{

    addOffer:(offer: Offer)=> Promise<void>;

}