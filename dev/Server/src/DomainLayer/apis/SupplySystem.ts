import { tShippingInfo } from "../purchase/Purchase";

class SupplySystem {
    private static nextReservationId: number = 1;
    private static nextSessionId: number = 1;
    private static shouldSucceed: boolean = true;

    //initializes system. returns a session id or negative number on failure
    static init = () : number => {
        return SupplySystem.shouldSucceed ? SupplySystem.nextSessionId++ : -1;
    }


    //reserves a shipment from @from to @to and @returns a unique shipment reservation number
    //this reservation number is needed for canceling and supplying the reservation
    static reserve = (shippingInfo: tShippingInfo) : number => {
        return SupplySystem.shouldSucceed ? SupplySystem.nextReservationId++ : -1;
    }
    

    //cancels the shipping reservation with id @reservationId and @returns true if suceeded
    //after calling this function, calling cancel/supply for the same reservation id will fail and return false
    static cancelReservation = (reservationId: number) :boolean => {
        return SupplySystem.shouldSucceed ? true : false;
    }

    //finalizes the shipping order with reservation id @reservationId
    //after calling this function, calling cancel/supply for the same reservation id will fail and return false
    static supply = (reservationId: number) : boolean => {
        return SupplySystem.shouldSucceed ? true : false;
    }

    static willSucceed = () => SupplySystem.shouldSucceed = true;
    static willFail = () => SupplySystem.shouldSucceed = false;
}

export default SupplySystem;