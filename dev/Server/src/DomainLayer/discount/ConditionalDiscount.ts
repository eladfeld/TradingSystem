import Categorizer from "./Categorizer";
import iCategory from "./iCategory";
import Discount from "./Discount";
import {iPredicate} from "./logic/Predicate";

class ConditionalDiscount extends Discount{
    private predicate: iPredicate;

    public getDiscount = (basket: [number, number, number][], categorizer: Categorizer):number =>  {
        const productsInCategory: number[] = categorizer.getProducts(this.category.getName());

        const discounts: number[] = basket.map(([product, price, quantity]) => {
            if(productsInCategory.includes(product)){
                return quantity*this.ratio*price;
            }else return 0;
        });
        var totalDiscount: number = 0;
        discounts.forEach((discount) => totalDiscount += discount);
        return totalDiscount;
        return -1;
    }

}