import {SimpleOps, CompositeOps, getSimpleOperator, getCompositeOperator} from './LogicalOperators';
import {CompositePredicate, SimplePredicate, Field, Value} from './Predicate';

//at least 1 #1000 and at least 2 #2000

const basket: number[][] = [
    [1000,100,1],//id, price, quantity
    [2000,200,2],
    [3000,300,3]
];

const val1: Value = new Value(1);
const val2: Value = new Value(2);

const quantity1000 = (b: number[][]):number =>{
    return b.find( p => p[0] === 1000)[2];
}

const simpPred1: SimplePredicate = new SimplePredicate(new Field(quantity1000), val1, getSimpleOperator(SimpleOps.GTE));

const quantity2000 = (b: number[][]):number =>{
    return b.find( p => p[0] === 2000)[2];
}

const simpPred2: SimplePredicate = new SimplePredicate(new Field(quantity2000), val2, getSimpleOperator(SimpleOps.GTE));

const compPred: CompositePredicate = new CompositePredicate(simpPred1, simpPred2, getCompositeOperator(CompositeOps.AND))
const isSatisfied: boolean = compPred.calc(basket);
console.log(isSatisfied);

