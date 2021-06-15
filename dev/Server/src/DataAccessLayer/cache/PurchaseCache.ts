import { TRANSACTIONS_CACHE_SIZE } from "../../../config";
import Transaction from "../../DomainLayer/purchase/Transaction";
import { purchaseDB } from "../dbs/PurchaseDB";
import { iPurchaseDB } from "../interfaces/iPurchaseDB";



export class PurchaseCache implements iPurchaseDB
{

    private transactions: Map<number, [boolean, Transaction]>
    private purchaseDB: iPurchaseDB;
    public constructor()
    {
        this.transactions = new Map();
        this.purchaseDB = new purchaseDB();
    }

    // private getTransaction(transactionId: number): Promise<Transaction>
    // {
    //     if(this.transactions.has(transactionId))
    //     {
    //         if(this.transactions.get(transactionId)[0])
    //             return Promise.resolve(this.transactions.get(transactionId)[1]);
    //     }
    //     let transactionPromise = this.purchaseDB.gettransaction(transactionId)
    //     return new Promise((resolve, reject) =>
    //     {
    //         transactionPromise
    //         .then(transaction => 
    //             {
    //                 this.cacheStore(transaction);
    //                 resolve(transaction);
    //             })
    //         .catch(e => reject(e))
    //     })
    // }

    private cacheTransaction(transaction: Transaction)
    {
        if(this.transactions.size >= TRANSACTIONS_CACHE_SIZE)
        {
            this.transactions.delete(this.transactions.keys().next().value)
        }
        this.transactions.set(transaction.getId(), [false, transaction]);
    }

    private StoreUpdateCache(storeId: number): void 
    {
        if(this.transactions.has(storeId))
        {
            this.transactions.get(storeId)[0] = true;
        }
    }



    public completeTransaction (transaction: Transaction) :Promise<boolean>{
        return this.purchaseDB.completeTransaction(transaction);
    }
    public getLastTransactionId ():Promise<number>
    {
        return this.purchaseDB.getLastTransactionId();
    }
    public getAllTransactions ():Promise<Transaction[]>
    {
        return this.purchaseDB.getAllTransactions()
    }
    public getCompletedTransactions ():Promise<Transaction[]>
    {
        return this.purchaseDB.getCompletedTransactions();
    }
    public storeTransaction (transaction: Transaction):Promise<void>
    {
        return this.storeTransaction(transaction);
    }
    public getTransactionInProgress (userId: number, storeId: number):Promise<Transaction>
    {
        return this.purchaseDB.getTransactionInProgress(userId, storeId)
    }
    public getTransactionsInProgress (userId: number, storeId: number):Promise<Transaction[]>
    {
        return this.purchaseDB.getTransactionsInProgress(userId, storeId);
    }
    public updateTransaction (transaction: Transaction):Promise<void>
    {
        return this.purchaseDB.updateTransaction(transaction);
    }
    public getUserStoreHistory(userId: number, storeId: number):Promise<Transaction[]>
    {
        return this.purchaseDB.getUserStoreHistory(userId, storeId);
    }
    public clear(): void
    {
        this.purchaseDB.clear();
    }
    
}