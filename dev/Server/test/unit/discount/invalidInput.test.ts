import { expect } from 'chai';
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

describe('Discount Tests - invalid inputs' , function() {

    it('invalid type' , function(){
        const disc: any = {
            type: "badType",
            category: 1,
            ratio: 0.15,
            predicate: {
                type: "simple",
                operator: ">",
                operand1: "1_quantity",
                operand2: 3
            }
        };
        const discountRes: Result<iDiscount> = DiscountParser.parse(disc);
        expect(isFailure(discountRes)).to.equal(true);
    });
    
    it('number for type' , function(){
        const disc: any = {
            type: 25,
            category: 1,
            ratio: 0.15,
            predicate: {
                type: "simple",
                operator: ">",
                operand1: "1_quantity",
                operand2: 3
            }
        };
        const discountRes: Result<iDiscount> = DiscountParser.parse(disc);
        expect(isFailure(discountRes)).to.equal(true);
    });

    it('string for ratio' , function(){
        const disc: any = {
            type: "conditional",
            category: 1,
            ratio: "badRatio",
            predicate: {
                type: "simple",
                operator: ">",
                operand1: "1_quantity",
                operand2: 3
            }
        };
        const discountRes: Result<iDiscount> = DiscountParser.parse(disc);
        console.log(`--------------\n`,discountRes);
        console.log(`----------------------`);
        expect(isFailure(discountRes)).to.equal(true);
    });

    it('conditional with invalid predicate' , function(){
        const disc: any = {
            type: "conditional",
            category: 1,
            ratio: 0.15,
            predicate: {
                type: "badType",
                operator: ">",
                operand1: "1_quantity",
                operand2: 3
            }
        };
        const discountRes: Result<iDiscount> = DiscountParser.parse(disc);
        expect(isFailure(discountRes)).to.equal(true);
    });

    it('conditional missing predicate' , function(){
        const disc: any = {
            type: "conditional",
            category: 1,
            ratio: 0.15
        };
        const discountRes: Result<iDiscount> = DiscountParser.parse(disc);
        expect(isFailure(discountRes)).to.equal(true);
    });

    it('invalid combo policy' , function(){
        const disc: any = {
            type: "combo",
            policy: "badPolicy",
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
        expect(isFailure(discountRes)).to.equal(true);
    });

    it('boolean for combo policy' , function(){
        const disc: any = {
            type: "combo",
            policy: true,
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
        expect(isFailure(discountRes)).to.equal(true);
    });

    it('combo with zero discounts' , function(){
        const disc: any = {
            type: "combo",
            policy: "add",
            discounts:[]
        };
        const discountRes: Result<iDiscount> = DiscountParser.parse(disc);
        expect(isFailure(discountRes)).to.equal(true);
    });

    it('combo with only one discount' , function(){
        const disc: any = {
            type: "combo",
            policy: "add",
            discounts:[{
                type: "unconditional",
                category: 1,
                ratio: 0.15
            }]
        };
        const discountRes: Result<iDiscount> = DiscountParser.parse(disc);
        expect(isFailure(discountRes)).to.equal(true);
    });

    it('combo without discount field' , function(){
        const disc: any = {
            type: "combo",
            policy: "add"
        };
        const discountRes: Result<iDiscount> = DiscountParser.parse(disc);
        expect(isFailure(discountRes)).to.equal(true);
    });

    it('combo with number discounts' , function(){
        const disc: any = {
            type: "combo",
            policy: "add",
            discounts: 100
        };
        const discountRes: Result<iDiscount> = DiscountParser.parse(disc);
        expect(isFailure(discountRes)).to.equal(true);
    });

    it('combo with invalid discount' , function(){
        const disc: any = {
            type: "combo",
            policy: true,
            discounts:[
                {
                    type: "unconditional",
                    category: 1,
                    ratio: "badRatio"
                },
                {
                    type: "unconditional",
                    category: "food",
                    ratio: 0.10
                }
            ]
        };
        const discountRes: Result<iDiscount> = DiscountParser.parse(disc);
        expect(isFailure(discountRes)).to.equal(true);
    });

    it('unrecognized field for conditional discount' , function(){
        const disc: any = {
            type: "conditional",
            category: 1,
            ratio: 0.15,
            predicate: {
                type: "simple",
                operator: ">",
                operand1: "badField",
                operand2: 3
            }
        };
        const discountRes: Result<iDiscount> = DiscountParser.parse(disc);
        expect(isOk(discountRes)).to.equal(true);
        if(isOk(discountRes)){
            const sale: Result<number> = discountRes.value.getDiscount(basket, categorizer);
            expect(isFailure(sale)).to.equal(true);
        }
    });
});
