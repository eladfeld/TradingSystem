import Purchase from "../purchase/Purchase";
import Transaction from "../purchase/Transaction";

export class StoreHistory
{
    private storeId: number;
    public constructor(storeId: number)
    {
        this.storeId = storeId;
    }

    public getPurchaseHistory() : Promise<Transaction[]>{
        return Purchase.getCompletedTransactionsForStore(this.storeId);
    }
}