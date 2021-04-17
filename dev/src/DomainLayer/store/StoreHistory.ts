<<<<<<< HEAD
import Transaction from "../purchase/Transaction"

=======
import Transaction from '../purchase/Transaction';
>>>>>>> d578fd2c25a62338ebf0c339f75238cba7beff1a
export class StoreHistory
{

    private storeId: number
    private storeName: string
    private createdAt: number
    private sales: Transaction[]


    public constructor(storeId: number, storeName: string, createdAt: number )
    {
        this.createdAt = createdAt
        this.storeId = storeId
        this.storeName = storeName
        this.sales = []
    }

    public saveTransaction(transaction: Transaction) {
        this.sales.push(transaction)
    }

    public getSale(): Transaction[] {
        return this.sales;
    }

}