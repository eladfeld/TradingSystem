import iCategorizer from "./Categorizer";

export default interface iDiscount{
    getDiscount: (basket:[number, number, number][], categorizer: iCategorizer) => number;

} 