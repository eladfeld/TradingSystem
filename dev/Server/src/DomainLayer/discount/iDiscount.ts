import { Result } from "../../Result";
import iCategorizer from "./Categorizer";
import { tDiscount } from "./Discount";
import iBasket from "./iBasket";

export default interface iDiscount{
    getDiscount: (basket:iBasket, categorizer: iCategorizer) => Promise<number>;
    toObj: () => tDiscount;
} 