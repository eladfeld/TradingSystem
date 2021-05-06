import { expect } from 'chai';
import iBasket, { MyBasket } from '../../../src/DomainLayer/discount/iBasket';
import DiscountParser from '../../../src/DomainLayer/discount/DiscountParser';
import iDiscount from '../../../src/DomainLayer/discount/iDiscount';
import iCategorizer from '../../../src/DomainLayer/discount/Categorizer';
import { TestBasket, TestCategorizer } from './common';
import { isOk, Result } from '../../../src/Result';



const example: any = {
    type: "combo",
    policy: "add",
    discounts:[
        {
            type: "unconditional",
            category: 1,
            ratio: 0.15
        },
        {
            type: "conditional",
            category: "fruit",
            ratio: 0.15,
            condtion:{
                type: "simple",
                operand1: 5,
                operator: ">",
                operand2: 2
            }
        }
    ]};
const basket: iBasket = new TestBasket();
const categorizer: iCategorizer = new TestCategorizer();
describe('Discount Tests - unconditional' , function() {

    it('15% off product#1' , function(){
        const disc: any = {
            type: "unconditional",
            category: 1,
            ratio: 0.15
        };
        
        const discountRes: Result<iDiscount> = DiscountParser.parse(disc);
        expect(isOk(discountRes)).to.equal(true);
        if(isOk(discountRes)){
            const sale: Result<number> = discountRes.value.getDiscount(basket, categorizer);
            expect(isOk(sale)).to.equal(true);
            if(isOk(sale))
                expect(sale.value).to.equal(150);
        }
    });
    
    it('25% off category food' , function(){
        const disc: any = {
            type: "unconditional",
            category: "food",
            ratio: 0.25
        };        
        const discountRes: Result<iDiscount> = DiscountParser.parse(disc);
        expect(isOk(discountRes)).to.equal(true);
        if(isOk(discountRes)){
            const sale: Result<number> = discountRes.value.getDiscount(basket, categorizer);
            expect(isOk(sale)).to.equal(true);
            if(isOk(sale))
                expect(sale.value).to.equal(1250);
        }
    });

    it('10% off the whole store' , function(){
        const disc: any = {
            type: "unconditional",
            category: 0,
            ratio: 0.10
        };        
        const discountRes: Result<iDiscount> = DiscountParser.parse(disc);
        expect(isOk(discountRes)).to.equal(true);
        if(isOk(discountRes)){
            const sale: Result<number> = discountRes.value.getDiscount(basket, categorizer);
            expect(isOk(sale)).to.equal(true);
            if(isOk(sale))
                expect(sale.value).to.equal(3000);
        }
    });

    it('50% off nothing in basket' , function(){
        const disc: any = {
            type: "unconditional",
            category: 'unicorns',
            ratio: 0.50
        };        
        const discountRes: Result<iDiscount> = DiscountParser.parse(disc);
        expect(isOk(discountRes)).to.equal(true);
        if(isOk(discountRes)){
            const sale: Result<number> = discountRes.value.getDiscount(basket, categorizer);
            expect(isOk(sale)).to.equal(true);
            if(isOk(sale))
                expect(sale.value).to.equal(0);
        }
    });
    
});

