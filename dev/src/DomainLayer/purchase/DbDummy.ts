import Transaction from "./Transaction";

class DbDummy{
    private completedTransactions: Transaction[];
    private transactionsInProgress: Transaction[];
    private usersAtCheckout: Map<number,Map<number,Map<number, number>>>;// userId => storeId => productId => quantity

    constructor(){
        this.completedTransactions = [];
        this.transactionsInProgress = [];
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
    removeTransactionInProgress = (userId: number, storeId: number):void =>{
        this.transactionsInProgress = this.transactionsInProgress.filter(t => ((t.getUserId() !== userId) || (t.getStoreId() !== storeId)));
    }
    getTransactionInProgress = (userId: number, storeId: number):Transaction =>{
        return this.transactionsInProgress.filter(t => ((t.getUserId() === userId) && (t.getStoreId() === storeId)))[0];
    }
    getTransactionsInProgress = (userId: number, storeId: number):Transaction[] =>{
        return this.transactionsInProgress.filter(t => ((t.getUserId() === userId) && (t.getStoreId() === storeId)));
    }

}

export default DbDummy;