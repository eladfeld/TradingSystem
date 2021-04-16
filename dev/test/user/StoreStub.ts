import { Store } from "../../src/DomainLayer/store/Store";
import { makeFailure, makeOk, Result } from "../../src/Result";

export class StoreStub extends Store
{
    constructor (storeOwner : number)
    {
        super(storeOwner , "Aluf hasport" , 123456 , "Tel aviv" );
    }
    public isProductAvailable(productId: number, quantity: number): Result<string> 
    {
        if (productId > 0)
            return makeOk("");
        else 
            return makeFailure("");
    }
}