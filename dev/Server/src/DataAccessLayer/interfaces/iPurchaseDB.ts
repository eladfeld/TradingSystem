import Transaction from "../../DomainLayer/purchase/Transaction";

export interface iPurchaseDB
{

    completeTransaction: (transaction: Transaction) => Promise<boolean>;

    getLastTransactionId: () => Promise<number>;
    
    getAllTransactions: () =>Promise<Transaction[]>;

    getCompletedTransactions: () => Promise<Transaction[]>;

    storeTransaction: (transaction: Transaction) => Promise<void>;

    getTransactionInProgress: (userId: number, storeId: number) =>Promise<Transaction> 

    getTransactionsInProgress: (userId: number, storeId: number) => Promise<Transaction[]>

    updateTransaction: (transaction: Transaction) => Promise<void>;

    getUserStoreHistory: (userId: number, storeId:number) => Promise<Transaction[]> 

    clear:() => void;
    willFail: () => void; 
    willSucceed: () => void; 

}