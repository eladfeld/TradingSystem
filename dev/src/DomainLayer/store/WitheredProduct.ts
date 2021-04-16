
export class WitheredProduct
{

    private productId: number;
    private name: string;
    private storeId: number;
    private price: number;
    private quantity: number;

    public constructor(productId: number, name: string, price: number, storeId: number, quantity:number)
    {
        this.productId = productId;
        this.name = name;
        this.price = price;
        this.storeId = storeId;
        this.quantity = quantity;
    }

    public getProductId()
    {
        return this.productId;
    }

    public getName()
    {
        return this.name;
    }

    public getStoreId()
    {
        return this.storeId;
    }

    public getPrice()
    {
        return this.price;
    }
    public getQuantity()
    {
        return this.quantity;
    }
}