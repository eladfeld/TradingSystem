export class Product
{

    private productId: number;
    private name: string;
    private storeId: number;
    private price: number;  
    private quantity: number;  

    public constructor(name: string, price: number, storeId: number, quantity:number)
    {
        this.productId = ID();
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

    public setQuantity(quantity: number){
        if(quantity < 0){
            throw "Quantity has to be non negative";
            
        }
        this.quantity = quantity;
    }

    public addQuantity(amount:number){
        if(amount < 0){
            throw "Amount has to be non negative";
            
        }
        this.quantity = this.quantity + amount;
    }

    isProductAvailable(productId: number, quantity: number): boolean {
        return false;
    }
}