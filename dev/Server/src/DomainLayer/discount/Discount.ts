import { Category } from "../store/Common";
import iCategorizer from "./Categorizer";
import iCategory from "./iCategory";
import iDiscount from "./iDiscount";

export default class Discount implements iDiscount{
    protected ratio: number;
    protected category: iCategory;
    public getDiscount: (basket:[number, number, number][], categorizer: iCategorizer) => number;
}