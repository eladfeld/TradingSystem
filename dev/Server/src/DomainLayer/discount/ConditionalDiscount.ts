import Categorizer from "./Categorizer";
import Discount from "./Discount";
import {iPredicate} from "./logic/Predicate";
import iBasket from "./iBasket";

export default class ConditionalDiscount extends Discount{
    private predicate: iPredicate<iBasket>;

    constructor(ratio: number, category: string|number, predicate: iPredicate<iBasket>){
        super(ratio, category);
        this.predicate = predicate;
    }

    public getDiscount = (basket: iBasket, categorizer: Categorizer):number =>  {
        const productsInCategory: number[] = this.getProductsInCategory(categorizer);
        const discounts: number[] = basket.getItems().map((prod) => {
            if(this.isWholeStore(productsInCategory) || productsInCategory.includes(prod.getId())){
                if(this.predicate.isSatisfied(basket)){
                    return prod.getQuantity()*this.ratio*prod.getPrice();
                }
            }
            return 0;
        });
        var totalDiscount: number = 0;
        discounts.forEach((discount) => totalDiscount += discount);
        return totalDiscount;
    }

    public getPredicate = () => this.predicate;

}