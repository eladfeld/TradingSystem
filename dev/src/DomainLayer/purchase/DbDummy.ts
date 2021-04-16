import Transaction from "./Transaction";

class DbDummy{
    private completedTransactions: Transaction[];
    private transactionsInProgress: Transaction[];
    private usersAtCheckout: Map<number,Map<number,Map<number, number>>>;// userId => storeId => productId => quantity

    constructor(){
        this.completedTransactions = [];
        this.usersAtCheckout = new Map();
    }

    storeCompletedTransaction = (transaction: Transaction) =>{
        this.completedTransactions.push(transaction);
    }
    getCompletedTransactions = ():Transaction[] => {
        return this.completedTransactions;
    }


    storeTransactionInProgress = (transaction: Transaction) =>{
        this.transactionsInProgress.push(transaction);
    }
    removeTransactionInProgress = (userId: number, storeId: number):Transaction =>{
        return null;
    }
    getTransactionInProgress = (userId: number, storeId: number):Transaction =>{
        return null;
    }


    storeReservation = (userId:number, cart: Map<number,Map<number, number>>) =>{
        this.usersAtCheckout.set(userId, cart);
    }

    deleteReservation = (UserId:number) => {
        this.usersAtCheckout.delete(UserId);
    }

    getReservation = (userId: number):Map<number,Map<number, number>> =>{
        return this.usersAtCheckout.get(userId);
    }

    updateReservation = (userId: number, cart: Map<number,Map<number, number>>):boolean =>{
        this.deleteReservation(userId);
        this.storeReservation(userId, cart);
        return true;
    }
}

export default DbDummy;