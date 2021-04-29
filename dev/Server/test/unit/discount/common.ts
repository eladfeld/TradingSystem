import { exception } from "console";
import iCategorizer from "../../../src/DomainLayer/discount/Categorizer";
import iBasket from "../../../src/DomainLayer/discount/iBasket";
import { iProduct, MyProduct } from "../../../src/DomainLayer/discount/iProduct";
import { iPredicate, SimplePredicate } from "../../../src/DomainLayer/discount/logic/Predicate";

export class TestCategorizer implements iCategorizer{
    constructor(){}

    public getProducts = (category: string) => {
        switch (category) {
            case 'food':
                return [1,2];
            case 'clothing':
                return [3];
            case 'electronics':
                return [4];        
            default:
                return [];
        }
    }
    public hasProduct = (category: string) => false;
    public addProductToCategory = (productId: number, category: string) => {};
    public removeProductFromCategory = (productId: number, category: string) => {};
    public addCategoryToCategory = (parent: string, child: string) => {};
    public moveCategory = (category: string, newParent: string) => {};
   
}

export class TestBasket implements iBasket{
    constructor(){}
    private basket: iProduct[] = [
        new MyProduct(1, 10, 100, 'apple',['food']),
        new MyProduct(2, 20, 200, 'banana',['food']),
        new MyProduct(3, 30, 300, 'gucci belt',['clothing']),
        new MyProduct(4, 40, 400, 'tv',['electronics'])
    ];
    
    getValue = (field: string):number => {
        const strs: string[] = field.split("_");
        if(strs.length === 2){
            const id: number = parseInt(strs[0]);
            const item: iProduct = this.basket.find(i => i.getId()==id);
            switch(strs[1]){
                case "price":
                    return item.getPrice();
                case "quantity":
                    return item.getQuantity();
                default:
                    throw exception(`TestCart does not have property '${strs[1]}'`);
            }
        }
        return -1;
    };
    public getItems = () => this.basket;
}
