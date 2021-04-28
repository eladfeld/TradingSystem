import { expect } from 'chai';
import { exception } from 'console';
import iBasket, { MyBasket } from '../../../src/DomainLayer/discount/iBasket';
import iSubject from '../../../src/DomainLayer/discount/logic/iSubject';
import {SimpleOps, CompositeOps, getSimpleOperator, getCompositeOperator} from '../../../src/DomainLayer/discount/logic/LogicalOperators';
import {CompositePredicate, SimplePredicate, Field, Value, iPredicate} from '../../../src/DomainLayer/discount/logic/Predicate';
import PredicateParser from '../../../src/DomainLayer/discount/logic/parser';



describe('Predicate Tests' , function() {

    it('2 > 1 -> true' , function(){
        const obj: any = {
            type: "simple",
            operator: ">",
            operand1: 2,
            operand2: 1
        };
        
        const pred: iPredicate<iSubject> = PredicateParser.parse(obj);
        expect(pred.isSatisfied(null)).to.equal(true);
    });
    
    it('2 < 1 -> false' , function(){
        const obj: any = {
            type: "simple",
            operator: "<",
            operand1: 2,
            operand2: 1
        };       
        const pred: iPredicate<iSubject> = PredicateParser.parse(obj);
        expect(pred.isSatisfied(null)).to.equal(false);
    });

    it('((2 < 1) AND (4 > 3)) -> true' , function(){
        const obj: any = {
            type: "composite",
            operator: "and",
            operands:[
                {
                    type: "simple",
                    operator: ">",
                    operand1: 2,
                    operand2: 1
                },
                {
                    type: "simple",
                    operator: ">",
                    operand1: 4,
                    operand2: 3
                }
            ]
        };       
        const pred: iPredicate<iSubject> = PredicateParser.parse(obj);
        expect(pred.isSatisfied(null)).to.equal(true);
    });

    it('((2 > 1) AND (4 > 3) AND (7<3)) -> false' , function(){
        const obj: any = {
            type: "composite",
            operator: "and",
            operands:[
                {
                    type: "simple",
                    operator: ">",
                    operand1: 2,
                    operand2: 1
                },
                {
                    type: "simple",
                    operator: ">",
                    operand1: 4,
                    operand2: 3
                },
                {
                    type: "simple",
                    operator: "<",
                    operand1: 7,
                    operand2: 3
                }
            ]
        };       
        const pred: iPredicate<iSubject> = PredicateParser.parse(obj);
        expect(pred.isSatisfied(null)).to.equal(false);
    });

    it('(quantity of product#1 > 0) -> true' , function(){
        //id, price, quantity, name
        const query: any = {
            type: "simple",
            operator: ">",
            operand1: "1_quantity",
            operand2: 0
        };
        const basket: iSubject = new MyBasket();     
        const pred: iPredicate<iSubject> = PredicateParser.parse(query);
        expect(pred.isSatisfied(basket)).to.equal(true);
    });

    it('((quantity of product#2 < 2) || (price of prod#2 > 1,000,000)) -> false' , function(){
        //id, price, quantity, name
        const query: any = {
            type: "composite",
            operator: "or",
            operands:[
                {
                    type: "simple",
                    operator: "<",
                    operand1: "2_quantity",
                    operand2: 2
                },
                {
                    type: "simple",
                    operator: ">",
                    operand1: "2_price",
                    operand2: 1000000
                }
            ]
        }; 
        const basket: iSubject = new MyBasket();     
        const pred: iPredicate<iSubject> = PredicateParser.parse(query);
        expect(pred.isSatisfied(basket)).to.equal(false);
    });

    it('((quantity of product#2 < 2) || (price of prod#2 < 1,000,000)) -> true' , function(){
        //id, price, quantity, name
        const query: any = {
            type: "composite",
            operator: "or",
            operands:[
                {
                    type: "simple",
                    operator: "<",
                    operand1: "2_quantity",
                    operand2: 2
                },
                {
                    type: "simple",
                    operator: "<",
                    operand1: "2_price",
                    operand2: 1000000
                }
            ]
        }; 
        const basket: iSubject = new MyBasket();     
        const pred: iPredicate<iSubject> = PredicateParser.parse(query);
        expect(pred.isSatisfied(basket)).to.equal(true);
    });

    
    it('(quantity of product#3 > price of product#3) -> true' , function(){
        //id, price, quantity, name
        const query: any = {
            type: "simple",
            operator: ">",
            operand1: "3_quantity",
            operand2: "3_price"
        };
        const basket: iSubject = new MyBasket();     
        const pred: iPredicate<iSubject> = PredicateParser.parse(query);
        expect(pred.isSatisfied(basket)).to.equal(true);
    });

    
});

