class SupplySystem {
    private static nextReservationId: number = 1;

    //initializes system. returns a session id or negative number on failure
    static init = () : number => {
        return 0;
    }


    //reserves a shipment from @from to @to and @returns a unique shipment reservation number
    //this reservation number is needed for canceling and supplying the reservation
    static reserve = (from: string, to:string) : number => {
        return SupplySystem.nextReservationId++;
    }
    

    //cancels the shipping reservation with id @reservationId and @returns true if suceeded
    //after calling this function, calling cancel/supply for the same reservation id will fail and return false
    static cancelReservation = (reservationId: number) :boolean => {
        return true;
    }

    //finalizes the shipping order with reservation id @reservationId
    //after calling this function, calling cancel/supply for the same reservation id will fail and return false
    static supply = (reservationId: number) : boolean => {
        return true;
    }
}

export default SupplySystem;