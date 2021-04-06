import { Product } from "./Product";

export class Inventory
{

    private products: Map<Product, number>

    public constructor(){
        this.products = new Map<Product, number>();
    }

    public addProduct(productName: string, quantity: number){
        let product = this.getProduct(productName);
        if(product){
            this.products.set(product, this.products.get(product) + quantity);
        }
        else{
            this.products.set(new Product(productName), quantity)
        }
    }

    public getProduct(productName: string) : Product{
        for (let [product, _] of this.products) {
            if(product.getName() == productName){
                return product;
            }
          }
        return null;
    }

}