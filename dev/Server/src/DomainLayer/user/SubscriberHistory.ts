import Purchase from "../purchase/Purchase";
import Transaction from "../purchase/Transaction";

export class SubscriberHistory
{
    private userId: number;
    public constructor(userId: number)
    {
        this.userId = userId;
    }

    public getPurchaseHistory() : string{
        return Purchase.getCompletedTransactionsForUser(this.userId)
    }
}