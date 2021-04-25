import iCategorizer from "./Categorizer";
import iBasket from "./iBasket";

export default interface iDiscount{
    getDiscount: (basket:iBasket, categorizer: iCategorizer) => number;
} 