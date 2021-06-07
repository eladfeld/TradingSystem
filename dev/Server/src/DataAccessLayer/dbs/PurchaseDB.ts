import Transaction from "../../DomainLayer/purchase/Transaction";
import { iPurchaseDB } from "../interfaces/iPurchaseDB";


class PurchaseDB implements iPurchaseDB
{
    getAllTransactions: () => Promise<Transaction[]>;
    storeCompletedTransaction: (transaction: Transaction) => void;
    getCompletedTransactions: () => Promise<Transaction[]>;
    storeTransaction: (transaction: Transaction) => void;
    getTransactionInProgress: (userId: number, storeId: number) => Promise<Transaction>;
    getTransactionsInProgress: (userId: number, storeId: number) => Promise<Transaction[]>;
    updateTransaction: (transaction: Transaction) => void;
    getUserStoreHistory: (userId: number, storeId: number) => Promise<Transaction[]>;
    clear: () => void;

}