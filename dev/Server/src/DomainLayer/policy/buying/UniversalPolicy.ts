import { categories } from "../../../ServiceLayer/state/InitialStateConstants";
import StateBuilder from "../../../ServiceLayer/state/StateBuilder";
import BuyingPolicy, { Rule } from "./BuyingPolicy";

const sb: StateBuilder = new StateBuilder();

const UniversalPolicy: BuyingPolicy = new BuyingPolicy();

export const initUniversalPolicy = () =>{ const res = UniversalPolicy.addPolicy(
    sb.compoundPred("=>",[
        sb.simplePred(`b_${categories.ALCOHOL}_quantity`,">",0),
        sb.simplePred("u_age",">=",18)
    ]),
    "Must be 18 or older to buy alcohol"
, -1);
res.then( _ => console.log(""))
.catch( error => {
    console.log(error)
})
}
export default UniversalPolicy;