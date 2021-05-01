import { Result } from "../../Result";
import iCategorizer from "./Categorizer";
import iBasket from "./iBasket";

export default interface iDiscount{
    getDiscount: (basket:iBasket, categorizer: iCategorizer) => Result<number>;
} 