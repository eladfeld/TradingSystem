import { Product } from "./Product";

export class Inventory
{

    private products: Map<string, Product>

    public constructor(){
        this.products = new Map<string, Product>();
    }

    public addNewProduct(productName: string, storeId: number, price: number, quantity = 0){
        if (quantity < 0){
            throw "Quantity must be non negative";
        }

        if (price < 0){
            throw "Price must be non negative";
        }

        if(this.products.has(productName)){
            throw "Product already exist in inventory!";
        }

        let product = new Product(productName,storeId,price,quantity);
        this.products.set(productName, product); 
    }

    public addProductQuantity(productName: string, quantity: number){
        let product = this.products.get(productName);
        if(product == null){
            throw "Product does not exist in inventory!";
        }
        product.addQuantity(quantity);
    }

    public setProductQuantity(productName: string, quantity: number){
        let product = this.products.get(productName);
        if(product==null){
            throw "Product does not exist in inventory!";
        }
        product.setQuantity(quantity);
    }

    public isProductAvailable(productName:string, quantity: number){
        let product = this.products.get(productName);
        if(product==null){
            throw "Product does not exist in inventory!";
        }
        return product.getQuantity() >= quantity;
    }



}