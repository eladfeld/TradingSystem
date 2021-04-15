import { Product } from "./Product";
import { Logger } from "../Logger";

export class Inventory
{

    private products: Map<number, Product>

    public constructor(){
        this.products = new Map<number, Product>();
    }

    public addNewProduct(productName: string, storeId: number, price: number, quantity = 0) : boolean{
        if (quantity < 0){
            Logger.error("Quantity must be non negative")
            return false;
        }

        if (price < 0){
            Logger.error("Price must be non negative")
            return false;
        }

        if(this.hasProductWithName(productName)){
            Logger.error("Product already exist in inventory!")
            return false;
        }

        let product = new Product(productName,storeId,price,quantity);
        this.products.set(product.getProductId(), product);
        return true; 
    }

    public addProductQuantity(productId: number, quantity: number) : boolean{
        let product = this.products.get(productId);
        if(product == null){
            Logger.error("Product does not exist in inventory!")
            return false;  
        }
        product.addQuantity(quantity);
        return true;
    }

    public setProductQuantity(productId: number, quantity: number) : boolean{
        let product = this.products.get(productId);
        if(product==null){
            Logger.error("Product does not exist in inventory!")
            return false;  
        }
        product.setQuantity(quantity);
        return true;
    }

    public isProductAvailable(productId: number, quantity: number) : boolean{
        let product = this.products.get(productId);
        if(product==null){
            Logger.error("Product does not exist in inventory!")
            return false;   
        }
        return product.getQuantity() >= quantity;
    }

    public hasProductWithName(productName: string) : boolean{
        for(let product of this.products.values()){
            if(product.getName() == productName){
                return true;
            }
        }
        return false;
    }



}