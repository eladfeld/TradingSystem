export class StoreHistory
{

    private storeId: number
    private storeName: string
    private createdAt: number
    private sales: any // TODO: change to transaction


    public constructor(storeId: number, storeName: string, createdAt: number )
    {
        this.createdAt = createdAt
        this.storeId = storeId
        this.storeName = storeName
        this.sales = new Map<number, Map<number, number>>()
    }

    public saveSale(buyerId: number, productId: number, quantity: number) {
        if(this.sales.has(buyerId)){
        } else {
        }
    }

    public getSale(): Map<number, Map<number, number>> {
        return this.sales;
    }

}