export class Product
{

    private productId: number;
    private name: string;    

    public constructor(name: string)
    {
        this.productId = ID();
        this.name = name;
    }

    public getProductId()
    {
        return this.productId;
    }

    public getName()
    {
        return this.name;
    }

    isProductAvailable(productId: number, quantity: number): boolean {
        return false;
    }
}