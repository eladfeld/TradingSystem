// import { expect } from 'chai';
// import { exception } from 'console';
// import iBasket, { MyBasket } from '../../../src/DomainLayer/discount/iBasket';
// import {SimpleOps, CompositeOps, getSimpleOperator, getCompositeOperator} from '../../../src/DomainLayer/discount/logic/LogicalOperators';
// import {CompositePredicate, SimplePredicate, Field, Value} from '../../../src/DomainLayer/discount/logic/Predicate';

// //at least 1 #1000 and at least 2 #2000
// describe('predicate tests' , function() {

//     it('satisfy predicate' , function(){
//         const val1: Value = new Value(1);
//         const val2: Value = new Value(2);

//         const simpPred1: SimplePredicate<MyBasket> = new SimplePredicate(new Field("1000_quantity"), val1, getSimpleOperator(SimpleOps.GTE));
//         const simpPred2: SimplePredicate<MyBasket> = new SimplePredicate(new Field("2000_quantity"), val2, getSimpleOperator(SimpleOps.GTE));
//         const compPred: CompositePredicate<MyBasket> = new CompositePredicate(simpPred1, simpPred2, getCompositeOperator(CompositeOps.AND))
//         const isSatisfied: boolean = compPred.isSatisfied(new MyBasket());
//         expect(isSatisfied).to.equal(true);
//     });
// });
