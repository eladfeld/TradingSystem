import { makeOk, Result } from '../../Result';
import iCategorizer from './Categorizer';
import Discount from './Discount';
import iBasket from './iBasket';

export default class UnconditionalDiscount extends Discount{
    constructor(ratio: number, category: string|number){
        super(ratio, category);
    }
    //TODO: improve algorithm. extremely inefficient!
    public getDiscount = (basket: iBasket, categorizer: iCategorizer): Result<number> => {
        const productsInCategory: number[] = this.getProductsInCategory(categorizer);
        const discounts: number[] = basket.getItems().map((prod) => {
            if(this.isWholeStore(productsInCategory) || productsInCategory.includes(prod.getId())){
                return prod.getQuantity()*this.ratio*prod.getPrice();
            }else return 0;
        });
        var totalDiscount: number = 0;
        discounts.forEach((discount) => totalDiscount += discount);
        return makeOk(totalDiscount);
    }
}