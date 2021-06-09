import { TEST_MODE } from "../../../config";
import { tShippingInfo } from "../purchase/Purchase";

class SupplySystem {
    private static nextReservationId: number = 1;
    private static nextSessionId: number = 1;
    private static shouldSucceed: boolean = true;

    //initializes system. returns a session id or negative number on failure
    static init = () : number => {
        return SupplySystem.shouldSucceed ? SupplySystem.nextSessionId++ : -1;
    }

    //finalizes the shipping order with reservation id @reservationId
    //after calling this function, calling cancel/supply for the same reservation id will fail and return false
    static supply = (shippingInfo:tShippingInfo) : number => {
        return SupplySystem.shouldSucceed ? SupplySystem.nextReservationId++ : -1;;
    }

    static cancel = (reservationId: number) :boolean => {
        return SupplySystem.shouldSucceed ? true : false;
    }

    static willSucceed = () => {
        if(!TEST_MODE) throw new Error("Cant force success outside of test mode!");
        SupplySystem.shouldSucceed = true;
    }
    static willFail = () => {
        if(!TEST_MODE) throw new Error("Cant force failure outside of test mode!");
        SupplySystem.shouldSucceed = false;
    }
}

export default SupplySystem;