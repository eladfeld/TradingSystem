import { Store } from "../../src/DomainLayer/store/Store";

export class StoreStub extends Store
{
    constructor (storeOwner : number)
    {
        super(storeOwner,"visible","visible");
    }
    public isProductAvailable(productId: number, quantity: number): boolean 
    {
        if (productId > 0)
            return true;
        else 
            return false;
    }
}