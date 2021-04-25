import iCategorizer from './Categorizer';
import iCategory from './iCategory';
import Discount from './Discount';
import iBasket from './iBasket';

class UnconditionalDiscount extends Discount{
    //TODO: improve algorithm. extremely inefficient!
    public getDiscount = (basket: iBasket, categorizer: iCategorizer): number => {
        const productsInCategory: number[] = categorizer.getProducts(this.category.getName());
        const discounts: number[] = basket.getItems().map((prod) => {
            if(productsInCategory.includes(prod.getId())){
                return prod.getQuantity()*this.ratio*prod.getPrice();
            }else return 0;
        });
        var totalDiscount: number = 0;
        discounts.forEach((discount) => totalDiscount += discount);
        return totalDiscount;
    }
}