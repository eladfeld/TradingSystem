import PaymentSystemAdapter from './PaymentSystemAdapter';
import SupplySystemAdapter from './SupplySystemAdapter';




class Purchase {

    private supplier: SupplySystemAdapter;
    private payer: PaymentSystemAdapter;
    private usersAtCheckout: number[];


    constructor(){
        this.payer = new PaymentSystemAdapter();
        this.supplier = new SupplySystemAdapter();
        this.usersAtCheckout = [];
    }

    checkout = () : boolean =>{
        this.supplier.reserve();
        return false;
    }

    chargeWithTimeout = ():boolean => {
        const charge = async ():Promise<boolean> => await false;
        const timeToPay = 300000;

        var isTimeUp = false;
        var timeoutId = setTimeout(()=>isTimeUp=true, timeToPay);
        charge();



        return false;
    }
    purchase = ():boolean => {
        //pay within 5 minutes
        // setTimeout(function() {
        //     return console.log(cue);
        // }, 5000);
        // var p : PaymentSystemAdapter = new PaymentSystemAdapter();
        this.payer.charge('', '', '');


        //reserve items
        //pay within 5 minutes (or release reservation and return)
        //order reserved items
        //store transaction to database
        //empty user cart?

        return true;
    };

    getTransactions = ():Transaction[] =>{
        return [];
    }

    storeTransaction = (transaction: Transaction):boolean => {
        return false;
    }

}