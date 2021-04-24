import iCategorizer from './Categorizer';
import iCategory from './iCategory';
import iDiscount from './iDiscount';

class UnconditionalDiscount extends iDiscount{



    //TODO: improve algorithm. extremely inefficient!
    public getDiscount = (basket: [number, number, number][], categorizer: iCategorizer): number => {
        const productsInCategory: number[] = categorizer.getProducts(this.category.getName());

        const discounts: number[] = basket.map(([product, price, quantity]) => {
            if(productsInCategory.includes(product)){
                return quantity*this.ratio*price;
            }else return 0;
        });
        var totalDiscount: number = 0;
        discounts.forEach((discount) => totalDiscount += discount);
        return totalDiscount;
    }
}