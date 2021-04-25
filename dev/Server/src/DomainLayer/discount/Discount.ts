import { Category } from "../store/Common";
import iCategorizer from "./Categorizer";
import iBasket from "./iBasket";
import iCategory from "./iCategory";
import iDiscount from "./iDiscount";

export default abstract class Discount implements iDiscount{
    protected ratio: number;
    protected category: iCategory;
    public getDiscount: (basket: iBasket, categorizer: iCategorizer) => number;
}