export class StoreHistory
{

    private storeId: number
    private storeName: string
    private createdAt: number
    private sales: Map<number, Map<number, number>> // maps userId to productId and quantitiy sold


    public constructor(storeId: number, storeName: string, createdAt: number )
    {
        this.createdAt = createdAt
        this.storeId = storeId
        this.storeName = storeName
        this.sales = new Map<number, Map<number, number>>()
    }

    public saveSale(buyerId: number, productId: number, quantity: number) {
        if(this.sales.has(buyerId)){
            this.sales.get(buyerId).set(productId, quantity)
        } else {
            this.sales.set(buyerId, new Map<number, number>().set(productId, quantity))
        }
    }

}