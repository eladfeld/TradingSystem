import { exception } from 'console';
import { iProduct, MyProduct } from './iProduct';
import iSubject from './logic/iSubject';

export default interface iBasket extends iSubject{
    getValue: (field: string) => number;
    getItems: () => iProduct[];//TODO: replace
}




//example implementation
export class MyBasket implements iBasket{
    constructor(){}
    private basket: iProduct[] = [1,2,3,4].map(n => new MyProduct(n, n*10, n*100, `product #${n}`, [`category${n}`]));
    
    getValue = (field: string):number => {
        const strs: string[] = field.split("_");
        if(strs.length === 2){
            const id: number = parseInt(strs[0]);
            const item: iProduct = this.basket.find(i => i.getId());
            switch(strs[1]){
                case "price":
                    return item.getPrice();
                case "quantity":
                    return item.getQuantity();
                default:
                    throw exception(`MyCart does not have property '${strs[1]}'`);
            }
        }
        return -1;
    };
    public getItems = () => this.basket;
}

//might be used for better predicate constraints
// export type iBasketProp = "price" | "id";
// export type iBasketField = [number, iBasketProp];

// export const iBasketProps = {
//     PRICE: "price",
//     ID: "id"
// }