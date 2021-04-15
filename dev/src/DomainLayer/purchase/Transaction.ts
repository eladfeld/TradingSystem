import { ShoppingCart } from "../user/ShoppingCart";
import { User } from "../user/User";

export const TransactionStatus = {
    IN_PROGRESS: 0,
    FAILED_RESERVE: 1,
    ITEMS_RESERVED: 2,
    PAID: 3,
    SUPPLIED: 4
};
Object.freeze(TransactionStatus);

class Transaction {

    
    public transcationId: number;
    public userId: number;
    //public date: Date;
    public total: number;
    public cardNumber: number;
    public items: Map<number, Map<number, [number, number]>>; //(storeId => (productId => [quantity, pricePer]))
    public status: number;
    public trace: Map<number, number>;
    
    private static nextId = 1;



    constructor(user: User, cart: ShoppingCart, paymentInfo: PaymentInfo){
        this.transcationId = Transaction.nextId++;
        this.userId = user.getUserId();
        this.cardNumber = paymentInfo.getCardNumber();
        this.items = this.cartToTree(user.shoppingCart);
        this.total = this.basketTotal(this.items);
        this.status = TransactionStatus.IN_PROGRESS;
        this.trace = new Map();
        this.trace.set(TransactionStatus.IN_PROGRESS, Date.now());
    }

    cartToTree = (cart: ShoppingCart):Map<number,Map<number, [number, number]>> =>{//stores => items => [quantity, pricePer]
        return null;
    }

    basketTotal = (items: Map<number, Map<number, [number, number]>>): number =>{
        return -1;
    }

}

export default Transaction;