import { Store } from "../../../src/DomainLayer/store/Store";
import { makeFailure, makeOk, Result } from "../../../src/Result";

export class StoreStub extends Store
{
    constructor (storeOwner : number  , storeName: string , bankacountNumber : number , address : string)
    {
        super(storeOwner , storeName , bankacountNumber ,address );
    }
    public isProductAvailable(productId: number, quantity: number): boolean
    {
        if (productId > 0)
            return true;
        else
            return false;
    }
}