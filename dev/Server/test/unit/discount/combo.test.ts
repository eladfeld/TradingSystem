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
import { isFailure, isOk, Result } from '../../../src/Result';

const basket: iBasket = new TestBasket();
const categorizer: iCategorizer = new TestCategorizer();
describe('Discount Tests - combo' , function() {

    it('15% off product#1 (apples) and 10% off food' , function(){
        const disc: any = {
            type: "combo",
            policy: "add",
            discounts:[
                {
                    type: "unconditional",
                    category: 1,
                    ratio: 0.15
                },
                {
                    type: "unconditional",
                    category: "food",
                    ratio: 0.10
                }
            ]
        };
        const discountRes: Result<iDiscount> = DiscountParser.parse(disc);
        expect(isOk(discountRes)).to.equal(true);
        if(isOk(discountRes)){
            const sale: number = discountRes.value.getDiscount(basket, categorizer);
            expect(sale).to.equal(650);
        }
    });

    it('15% off product#1 (apples) xor 10% off food' , function(){
        const disc: any = {
            type: "combo",
            policy: "max",
            discounts:[
                {
                    type: "unconditional",
                    category: 1,
                    ratio: 0.15
                },
                {
                    type: "unconditional",
                    category: "food",
                    ratio: 0.10
                }
            ]
        };
        const discountRes: Result<iDiscount> = DiscountParser.parse(disc);
        expect(isOk(discountRes)).to.equal(true);
        if(isOk(discountRes)){
            const sale: number = discountRes.value.getDiscount(basket, categorizer);
            expect(sale).to.equal(500);
        }
    });

        
});

