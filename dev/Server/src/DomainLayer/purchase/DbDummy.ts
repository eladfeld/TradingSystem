import { exception } from "console";
import Transaction, { TransactionStatus } from "./Transaction";

class DbDummy{
    private transactions: Transaction[];

    constructor(){
        this.transactions = [];
    }

    getAllTransactions = () => {
        return [...this.transactions];
    }
    storeCompletedTransaction = (transaction: Transaction) =>{
        this.transactions.push(transaction);
    }
    getCompletedTransactions = ():Transaction[] => {
        return this.transactions.filter(t => t.getStatus() == TransactionStatus.COMPLETE);
    }

    storeTransaction = (transaction: Transaction) =>{
        this.transactions.push(transaction);
    }

    getTransactionInProgress = (userId: number, storeId: number):Transaction =>{
        const ts:Transaction[] = this.transactions.filter(t => ((t.getUserId() === userId) && (t.getStoreId() === storeId) && (t.getStatus() === TransactionStatus.IN_PROGRESS)));
        if(ts.length === 0)return null;
        if(ts.length > 1) throw exception(`userId: ${userId} and storeId: ${storeId} have ${ts.length} transactions in progress.\n should be at most 1`);
        return ts[0];
    }
    getTransactionsInProgress = (userId: number, storeId: number):Transaction[] =>{
        return this.transactions.filter(t => ((t.getUserId() === userId) && (t.getStoreId() === storeId) && (t.getStatus() === TransactionStatus.IN_PROGRESS)));
    }

    updateTransaction = (transaction: Transaction) => {
        const ts: Transaction[] = this.transactions.filter(t => t.getId() !== transaction.getId());
        ts.push(transaction);
        this.transactions = ts;
    }

}

export default DbDummy;