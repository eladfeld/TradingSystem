import { iPurchaseDB } from "../interfaces/iPurchaseDB";
import Transaction, { TransactionStatus } from "../../DomainLayer/purchase/Transaction";
import { sequelize } from "../connectDb";

export class PurchaseDummyDB implements iPurchaseDB{
    private transactions: Transaction[];

    constructor(){
        this.transactions = [];
    }
    public completeTransaction(transaction: Transaction):Promise<boolean>
    {
        return Promise.resolve(true)
    }

    public getLastTransactionId(): Promise<number>
    {
        return Promise.resolve(1);
    }

    getAllTransactions = () : Promise<Transaction[]> => {
        return Promise.resolve([...this.transactions]);
    }

    getCompletedTransactions = (): Promise<Transaction[]> => {
        return Promise.resolve(this.transactions.filter(t => t.getStatus() == TransactionStatus.COMPLETE));
    }

    storeTransaction = async (transaction: Transaction) =>{
        this.transactions.push(transaction);
        return Promise.resolve()
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
        return Promise.resolve()
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