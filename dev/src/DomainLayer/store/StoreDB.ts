import { Store } from "./Store";

export class StoreDB
{

    private static stores: Store[]  = [];

    public static addStore(store: Store): void
    {
        this.stores.push(store);
    }

    public static getStoreByID(storeId: number): void
    {

        this.stores.find(store => store.getStoreId() == storeId);
    }

}