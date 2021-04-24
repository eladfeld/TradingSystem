import { Category } from "../store/Common";
import iCategorizer from "./Categorizer";
import iCategory from "./iCategory";

export default class iDiscount{
    protected ratio: number;
    protected category: iCategory;
    public getDiscount: (basket:[number, number, number][], categorizer: iCategorizer) => number;
}