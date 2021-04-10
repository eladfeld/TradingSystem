

export class Store
{


    private storeId: number;
    public constructor()
    {

    }

    public getStoreId()
    {
        return this.storeId;
    }

    isProductAvailable(productId: number, quantity: number): boolean {
        return false;
    }
}