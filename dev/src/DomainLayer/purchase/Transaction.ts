import { ShoppingCart } from "../user/ShoppingCart";
import { User } from "../user/User";

export const TransactionStatus = {
    TIMED_OUT: -3,
    FAIL_RESERVE: -2,
    CANCELED: -1,
    IN_PROGRESS: 0,
    ITEMS_RESERVED: 2,
    PAID: 3,
    SUPPLIED: 4
};
Object.freeze(TransactionStatus);

class Transaction {

    
    private transcationId: number;
    private userId: number;
    private storeId: number;
    private total: number;
    private cardNumber: number;
    private items: Map<number, number>; //productId => quantity
    private status: number;
    private time: number;
    private shipmentId: number;
    
    private static nextId = 1;



    constructor(userId: number, storeId: number, items: Map<number, number>, total:number ){
        this.transcationId = Transaction.nextId++;
        this.userId = userId;
        this.storeId = storeId;
        this.items = items;//this.cartToTree(user.shoppingCart);
        this.total = total;//this.basketTotal(this.items);
        this.status = TransactionStatus.IN_PROGRESS;
        this.time = Date.now();
        this.cardNumber = null;
        this.shipmentId = -1;
    }

    setShipmentId = (shipmentId: number):void => {
        this.shipmentId = shipmentId;
    }

    setStatus = (status: number) =>{
        this.status = status;
    }

    getTotal = (): number => this.total;

    getId = () : number => this.transcationId;
    getShipmentId = () : number => this.shipmentId;




    cartToTree = (cart: ShoppingCart):Map<number,Map<number, [number, number]>> =>{//stores => items => [quantity, pricePer]
        return null;
    }

    basketTotal = (items: Map<number, Map<number, [number, number]>>): number =>{
        return -1;
    }

}

export default Transaction;