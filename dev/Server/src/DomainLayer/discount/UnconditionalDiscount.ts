import { makeOk, Result } from '../../Result';
import iCategorizer from './Categorizer';
import Discount, { tUnconditionalDiscount } from './Discount';
import iBasket from './iBasket';

export default class UnconditionalDiscount extends Discount{
    constructor(ratio: number, category: string|number){
        super(ratio, category);
    }
    //TODO: improve algorithm. extremely inefficient!
    public getDiscount = async (basket: iBasket, categorizer: iCategorizer): Promise<number> => {
        const productsInCategory: number[] =await this.getProductsInCategory(categorizer);
        const discounts: number[] =(await basket.getItems()).map((prod) => {
            if(this.isWholeStore(productsInCategory) || productsInCategory.includes(prod.getProductId())){
                return prod.getQuantity()*this.ratio*prod.getPrice();
            }else return 0;
        });
        var totalDiscount: number = 0;
        discounts.forEach((discount) => totalDiscount += discount);
        return Promise.resolve(totalDiscount);
    }

    public toObj = ():tUnconditionalDiscount =>{
        return{
            type:"unconditional",
            ratio:this.ratio,
            category:this.category
        }
    }
}