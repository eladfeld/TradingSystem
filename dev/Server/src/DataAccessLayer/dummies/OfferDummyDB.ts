import { Offer } from "../../DomainLayer/offer/Offer";
import { iOfferDB } from "../interfaces/iOfferDB";

export class OfferDummyDB implements iOfferDB
{
    addOffer: (offer: Offer) => Promise<void>;

}