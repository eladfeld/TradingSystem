import { expect } from 'chai';
import iBasket, { MyBasket } from '../../../src/DomainLayer/discount/iBasket';
import iSubject from '../../../src/DomainLayer/discount/logic/iSubject';
import {SimpleOps, CompositeOps, getSimpleOperator, getCompositeOperator} from '../../../src/DomainLayer/discount/logic/LogicalOperators';
import {CompositePredicate, SimplePredicate, Field, Value, iPredicate} from '../../../src/DomainLayer/discount/logic/Predicate';
import PredicateParser from '../../../src/DomainLayer/discount/logic/parser';
import { isOk, Result } from '../../../src/Result';



describe('Predicate Tests' , function() {

    it('2 > 1 -> true' , function(){
        const obj: any = {
            type: "simple",
            operator: ">",
            operand1: 2,
            operand2: 1
        };
        
        const predRes: Result<iPredicate> = PredicateParser.parse(obj);
        expect(isOk(predRes)).to.equal(true);
        if(isOk(predRes)){
            const res: Result<boolean> = predRes.value.isSatisfied(null);
            expect(isOk(res)).to.equal(true);
            if(isOk(res)){
                expect(res.value).to.equal(true);
            }
        }
    });
    
    it('2 < 1 -> false' , function(){
        const obj: any = {
            type: "simple",
            operator: "<",
            operand1: 2,
            operand2: 1
        };       
        const predRes: Result<iPredicate> = PredicateParser.parse(obj);
        expect(isOk(predRes)).to.equal(true);
        if(isOk(predRes)){
            const res: Result<boolean> = predRes.value.isSatisfied(null);
            expect(isOk(res)).to.equal(true);
            if(isOk(res)){
                expect(res.value).to.equal(false);
            }
        }
    });

    it('((2 > 1) AND (4 > 3)) -> true' , function(){
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
        const predRes: Result<iPredicate> = PredicateParser.parse(obj);
        expect(isOk(predRes)).to.equal(true);
        if(isOk(predRes)){
            const res: Result<boolean> = predRes.value.isSatisfied(null);
            expect(isOk(res)).to.equal(true);
            if(isOk(res)){
                expect(res.value).to.equal(true);
            }
        }
    });

    it('((1 > 2) IFF (3 > 4)) -> true' , function(){
        const obj: any = {
            type: "composite",
            operator: "iff",
            operands:[
                {
                    type: "simple",
                    operator: ">",
                    operand1: 1,
                    operand2: 2
                },
                {
                    type: "simple",
                    operator: ">",
                    operand1: 3,
                    operand2: 4
                }
            ]
        };       
        const predRes: Result<iPredicate> = PredicateParser.parse(obj);
        expect(isOk(predRes)).to.equal(true);
        if(isOk(predRes)){
            const res: Result<boolean> = predRes.value.isSatisfied(null);
            expect(isOk(res)).to.equal(true);
            if(isOk(res)){
                expect(res.value).to.equal(true);
            }
        }
    });

    it('((1 < 2) IFF (3 < 4)) -> true' , function(){
        const obj: any = {
            type: "composite",
            operator: "iff",
            operands:[
                {
                    type: "simple",
                    operator: "<",
                    operand1: 1,
                    operand2: 2
                },
                {
                    type: "simple",
                    operator: "<",
                    operand1: 3,
                    operand2: 4
                }
            ]
        };       
        const predRes: Result<iPredicate> = PredicateParser.parse(obj);
        expect(isOk(predRes)).to.equal(true);
        if(isOk(predRes)){
            const satRes: Result<boolean> = predRes.value.isSatisfied(null);
            expect(isOk(satRes)).to.equal(true);
            if(isOk(satRes)){
                expect(satRes.value).to.equal(true);
            }
        }
    });

    it('((1 < 2) IFF (3 > 4)) -> false' , function(){
        const obj: any = {
            type: "composite",
            operator: "iff",
            operands:[
                {
                    type: "simple",
                    operator: "<",
                    operand1: 1,
                    operand2: 2
                },
                {
                    type: "simple",
                    operator: ">",
                    operand1: 3,
                    operand2: 4
                }
            ]
        };       
        const predRes: Result<iPredicate> = PredicateParser.parse(obj);
        expect(isOk(predRes)).to.equal(true);
        if(isOk(predRes)){
            const satRes: Result<boolean> = predRes.value.isSatisfied(null);
            expect(isOk(satRes)).to.equal(true);
            if(isOk(satRes)){
                expect(satRes.value).to.equal(false);
            }
        }
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
        const predRes: Result<iPredicate> = PredicateParser.parse(obj);
        expect(isOk(predRes)).to.equal(true);
        if(isOk(predRes)){
            const res: Result<boolean> = predRes.value.isSatisfied(null);
            expect(isOk(res)).to.equal(true);
            if(isOk(res)){
                expect(res.value).to.equal(false);
            }
        }
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
        const predRes: Result<iPredicate> = PredicateParser.parse(query);
        expect(isOk(predRes)).to.equal(true);
        if(isOk(predRes)){
            const res: Result<boolean> = predRes.value.isSatisfied(basket);
            expect(isOk(res)).to.equal(true);
            if(isOk(res)){
                expect(res.value).to.equal(true);
            }
        }
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
        const predRes: Result<iPredicate> = PredicateParser.parse(query);
        expect(isOk(predRes)).to.equal(true);
        if(isOk(predRes)){
            const res: Result<boolean> = predRes.value.isSatisfied(basket);
            expect(isOk(res)).to.equal(true);
            if(isOk(res)){
                expect(res.value).to.equal(false);
            }
        }
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
        const predRes: Result<iPredicate> = PredicateParser.parse(query);
        expect(isOk(predRes)).to.equal(true);
        if(isOk(predRes)){
            const res: Result<boolean> = predRes.value.isSatisfied(basket);
            expect(isOk(res)).to.equal(true);
            if(isOk(res)){
                expect(res.value).to.equal(true);
            }
        }
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
        const predRes: Result<iPredicate> = PredicateParser.parse(query);
        expect(isOk(predRes)).to.equal(true);
        if(isOk(predRes)){
            const res: Result<boolean> = predRes.value.isSatisfied(basket);
            expect(isOk(res)).to.equal(true);
            if(isOk(res)){
                expect(res.value).to.equal(true);
            }
        }
    });

    
});

