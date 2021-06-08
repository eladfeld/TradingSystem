import { isFailure, isOk } from "../../../Result";
import { categories } from "../../../ServiceLayer/state/InitialStateConstants";
import StateBuilder from "../../../ServiceLayer/state/StateBuilder";
import PredicateParser from "../../discount/logic/parser";
import { iPredicate } from "../../discount/logic/Predicate";
import BuyingPolicy, { Rule } from "./BuyingPolicy";

const sb: StateBuilder = new StateBuilder();

const UniversalPolicy: BuyingPolicy = new BuyingPolicy();

const res = UniversalPolicy.addPolicy(
    sb.compoundPred("=>",[
        sb.simplePred(`b_${categories.ALCOHOL}_quantity`,">",0),
        sb.simplePred("u_age",">=",18)  
    ]),
    "Must be 18 or older to buy alcohol"
, -1);


export default UniversalPolicy;