import { iPurchaseDB } from "../interfaces/iPurchaseDB";
import Transaction, { TransactionStatus } from "../../DomainLayer/purchase/Transaction";

export class PurchaseDummyDB implements iPurchaseDB{
    private transactions: Transaction[];

    constructor(){
        this.transactions = [];
    }

    getAllTransactions = () : Promise<Transaction[]> => {
        return Promise.resolve([...this.transactions]);
    }

    storeCompletedTransaction = (transaction: Transaction) =>{
        this.transactions.push(transaction);
    }

    getCompletedTransactions = (): Promise<Transaction[]> => {
        return Promise.resolve(this.transactions.filter(t => t.getStatus() == TransactionStatus.COMPLETE));
    }

    storeTransaction = (transaction: Transaction) =>{
        this.transactions.push(transaction);
    }

    getTransactionInProgress = (userId: number, storeId: number): Promise<Transaction> =>{
        const ts:Transaction[] = this.transactions.filter(t => ((t.getUserId() === userId) && (t.getStoreId() === storeId) && (t.getStatus() === TransactionStatus.IN_PROGRESS)));
        if(ts.length === 0) return Promise.reject(null);
        if(ts.length > 1) throw (`userId: ${userId} and storeId: ${storeId} have ${ts.length} transactions in progress.\n should be at most 1`);
        return Promise.resolve(ts[0]);
    }

    getTransactionsInProgress = (userId: number, storeId: number): Promise<Transaction[]> =>{
        return Promise.resolve(this.transactions.filter(t => ((t.getUserId() === userId) && (t.getStoreId() === storeId) && (t.getStatus() === TransactionStatus.IN_PROGRESS))));
    }

    updateTransaction = (transaction: Transaction) => {
        const ts: Transaction[] = this.transactions.filter(t => t.getId() !== transaction.getId());
        ts.push(transaction);
        this.transactions = ts;
    }

    public clear()
    {
        this.transactions = [];
    }

    getUserStoreHistory = (userId: number, storeId:number) : Promise<Transaction[]> => {
        return Promise.resolve(this.transactions.filter(t => t.getUserId()===userId && t.getStoreId()===storeId).sort( (a,b) => {
            const dt:number = b.getTime() - a.getTime();
            return dt !== 0 ? dt : a.getStatus() - b.getStatus();
        }));
    }

}