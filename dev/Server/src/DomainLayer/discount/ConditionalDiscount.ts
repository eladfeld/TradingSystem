import Categorizer from "./Categorizer";
import iCategory from "./iCategory";
import Discount from "./Discount";
import {iPredicate} from "./logic/Predicate";
import iBasket from "./iBasket";

class ConditionalDiscount extends Discount{
    private predicate: iPredicate<iBasket>;

    public getDiscount = (basket: iBasket, categorizer: Categorizer):number =>  {
        const productsInCategory: number[] = categorizer.getProducts(this.category.getName());
        const discounts: number[] = basket.getItems().map((prod) => {
            if(productsInCategory.includes(prod.getId())){
                if(this.predicate.isSatisfied(basket)){
                    return prod.getQuantity()*this.ratio*prod.getPrice();
                }
            }else return 0;
        });
        var totalDiscount: number = 0;
        discounts.forEach((discount) => totalDiscount += discount);
        return totalDiscount;
    }

}