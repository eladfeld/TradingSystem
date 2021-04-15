import PaymentSystemAdapter from './PaymentSystemAdapter';
import SupplySystemAdapter from './SupplySystemAdapter';

import { User } from '../user/User';
import Transaction from './Transaction';
import DbDummy from './DbDummy';
import { ShoppingCart } from '../user/ShoppingCart';

class Purchase {

    private supplySystem: SupplySystemAdapter;
    private paymentSystem: PaymentSystemAdapter;
    private usersCheckoutTimers: Map<number,ReturnType<typeof setTimeout>>;
    private dbDummy: DbDummy;


    constructor(){
        this.paymentSystem = new PaymentSystemAdapter();
        this.supplySystem = new SupplySystemAdapter();
        this.usersCheckoutTimers = new Map();
        this.dbDummy = new DbDummy();
    }

    checkout = (user: User) : boolean =>{
        const userId: number = user.getUserId();
        //check if a previous checkout attempt is still "in progress"
        //cancel previous checkouts timer if exists
        const timerId = this.usersCheckoutTimers.get(userId);
        if( timerId !== undefined){
            //a checkout is already in progress, make sure cart has not changed
            clearTimeout(timerId);
            this.usersCheckoutTimers.delete(userId);
        }

        //update products reservation in case cart has changed since a previous checkout attempt
        const currReservation: Map<number,Map<number, number>> = this.dbDummy.getReservation(userId);
        var isReserved:boolean = true;
        if(!this.cartEqualsReservation(user.shoppingCart, currReservation)){
            //cart has been updated since last checkout attempt
            isReserved = this.supplySystem.updateReservation(currReservation, this.cartAsTree(user.shoppingCart));
            this.dbDummy.updateReservation(userId, this.cartAsTree(user.shoppingCart))
        }
        else if( currReservation !== undefined){
            isReserved = this.supplySystem.reserve(this.cartAsTree(user.shoppingCart));
        }
        
        if(isReserved){
            //reserve items and allow payment within 5 minutes
            this.dbDummy.storeReservation(userId, this.cartAsTree(user.shoppingCart));
            const timerId: ReturnType<typeof setTimeout> = setTimeout(() => {
                this.dbDummy.deleteReservation(userId);
                this.usersCheckoutTimers.delete(userId)
            }, 300000);
            this.usersCheckoutTimers.set(userId, timerId);
            return true;
        }else{
            return false;
        }


        return false;
    }

    checkoutNew = (user: User) : boolean =>{
        const userId: number = user.getUserId();
        //check if a previous checkout attempt is still "in progress"
        //cancel previous checkouts timer if exists
        const timerId = this.usersCheckoutTimers.get(userId);
        if( timerId !== undefined){
            //a checkout is already in progress, make sure cart has not changed
            clearTimeout(timerId);
            this.usersCheckoutTimers.delete(userId);
        }

        //update products reservation in case cart has changed since a previous checkout attempt
        const currReservation: Map<number,Map<number, number>> = this.dbDummy.getReservation(userId);
        var isReserved:boolean = true;
        if(!this.cartEqualsReservation(user.shoppingCart, currReservation)){
            //cart has been updated since last checkout attempt
            isReserved = this.supplySystem.updateReservation(currReservation, this.cartAsTree(user.shoppingCart));
            this.dbDummy.updateReservation(userId, this.cartAsTree(user.shoppingCart))
        }
        else if( currReservation !== undefined){
            isReserved = this.supplySystem.reserve(this.cartAsTree(user.shoppingCart));
        }
        
        if(isReserved){
            //reserve items and allow payment within 5 minutes
            this.dbDummy.storeReservation(userId, this.cartAsTree(user.shoppingCart));
            const timerId: ReturnType<typeof setTimeout> = setTimeout(() => {
                this.dbDummy.deleteReservation(userId);
                this.usersCheckoutTimers.delete(userId)
            }, 300000);
            this.usersCheckoutTimers.set(userId, timerId);
            return true;
        }else{
            return false;
        }


        return false;
    }

    CompleteOrder = (user: User, paymentInfo: PaymentInfo) : boolean => {
        const timerId = this.usersCheckoutTimers.get(user.getUserId()); 
        if(timerId !== undefined){
            
            const isPaid: boolean = this.paymentSystem.charge(paymentInfo);
            if(isPaid){
                const isSupplied: boolean = this.supplySystem.supply("TODO",user.shoppingCart);
                if(isSupplied){
                    //make transaction and store
                    const transaction: Transaction = new Transaction(user, user.shoppingCart, paymentInfo);
                    this.dbDummy.storeTransaction(transaction);
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    cartAsTree = (cart: ShoppingCart):Map<number,Map<number, [number, number]>> =>{//stores => items => [quantity, pricePer]
        return null;
    }
    cartEqualsReservation = (cart:ShoppingCart, res: Map<number,Map<number, number>>):boolean =>{
        return false;
    }

}