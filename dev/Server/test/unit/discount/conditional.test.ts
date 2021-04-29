import { expect } from 'chai';
import { exception } from 'console';
import iBasket, { MyBasket } from '../../../src/DomainLayer/discount/iBasket';
import iSubject from '../../../src/DomainLayer/discount/logic/iSubject';
import {SimpleOps, CompositeOps, getSimpleOperator, getCompositeOperator} from '../../../src/DomainLayer/discount/logic/LogicalOperators';
import {CompositePredicate, SimplePredicate, Field, Value, iPredicate} from '../../../src/DomainLayer/discount/logic/Predicate';
import PredicateParser from '../../../src/DomainLayer/discount/logic/parser';
import DiscountParser from '../../../src/DomainLayer/discount/DiscountParser';
import iDiscount from '../../../src/DomainLayer/discount/iDiscount';
import iCategorizer from '../../../src/DomainLayer/discount/Categorizer';
import { TestBasket, TestCategorizer } from './common';

const basket: iBasket = new TestBasket();
const categorizer: iCategorizer = new TestCategorizer();
describe('Discount Tests - unconditional' , function() {

    it('more than 3 of product#1 => 15% off product#1 (satisfy)' , function(){
        const disc: any = {
            type: "conditional",
            category: 1,
            ratio: 0.15,
            predicate: {
                type: "simple",
                operator: ">",
                operand1: "1_quantity",
                operand2: 3
            }
        };
        
        const discount: iDiscount = DiscountParser.parse(disc);
        const sale: number = discount.getDiscount(basket, categorizer);
        expect(sale).to.equal(150);
    });
    
    it('more than 1,000,000 of product#1 => 25% off category food (not satisfied)' , function(){
        const disc: any = {
            type: "unconditional",
            category: "food",
            ratio: 0.25,
            predicate: {
                type: "simple",
                operator: ">",
                operand1: "1_quantity",
                operand2: 1000000
            }
        };        
        const discount: iDiscount = DiscountParser.parse(disc);
        const sale: number = discount.getDiscount(basket, categorizer);
        expect(sale).to.equal(1250);
    });

    it('more than 5 of product#1 => at 10% off food category (satisfied)' , function(){
        const disc: any = {
            type: "conditional",
            category: "food",
            ratio: 0.10,
            predicate: {
                type: "simple",
                operator: ">",
                operand1: "1_quantity",
                operand2: 5
            }
        };        
        const discount: iDiscount = DiscountParser.parse(disc);
        const sale: number = discount.getDiscount(basket, categorizer);
        expect(sale).to.equal(500);
    });

    it('50% off nothing in basket' , function(){
        const disc: any = {
            type: "unconditional",
            category: 'unicorns',
            ratio: 0.50
        };        
        const discount: iDiscount = DiscountParser.parse(disc);
        const sale: number = discount.getDiscount(basket, categorizer);
        expect(sale).to.equal(0);
    });
    
});

