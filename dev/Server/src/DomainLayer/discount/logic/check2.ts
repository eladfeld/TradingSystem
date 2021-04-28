import iSubject from "./iSubject";
import PredicateParser from "./parser";
import { iPredicate } from "./Predicate";

const obj: any = {
    type: "simple",
    operater: ">",
    operand1: 2,
    operand2: 1
};

const pred: iPredicate<iSubject> = PredicateParser.parse(obj);
console.log(pred);