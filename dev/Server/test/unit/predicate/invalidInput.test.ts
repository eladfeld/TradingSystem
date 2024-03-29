import { expect } from 'chai';
import {iPredicate} from '../../../src/DomainLayer/discount/logic/Predicate';
import PredicateParser from '../../../src/DomainLayer/discount/logic/parser';
import { isFailure, isOk, Result } from '../../../src/Result';
import { MyBasket } from '../../../src/DomainLayer/discount/iBasket';
import iSubject from '../../../src/DomainLayer/discount/logic/iSubject';

describe('predicate parser - invalid inputs' , function() {

    it('invalid type' , function(){
        //id, price, quantity, name
        const query: any = {
            type: "badType",
            operator: ">",
            operand1: 1,
            operand2: 0
        };
        const predRes: Result<iPredicate> = PredicateParser.parse(query);
        expect(isFailure(predRes)).to.equal(true);
    });

    it('number for type' , function(){
        //id, price, quantity, name
        const query: any = {
            type: 100,
            operator: ">",
            operand1: 1,
            operand2: 0
        };
        const predRes: Result<iPredicate> = PredicateParser.parse(query);
        expect(isFailure(predRes)).to.equal(true);
    });

    it('invalid simple operator' , function(){
        //id, price, quantity, name
        const query: any = {
            type: "simple",
            operator: "badOperator",
            operand1: 1,
            operand2: 0
        };
        const predRes: Result<iPredicate> = PredicateParser.parse(query);
        expect(isFailure(predRes)).to.equal(true);
    });

    it('number for simple operator' , function(){
        //id, price, quantity, name
        const query: any = {
            type: "simple",
            operator: 20,
            operand1: 1,
            operand2: 0
        };
        const predRes: Result<iPredicate> = PredicateParser.parse(query);
        expect(isFailure(predRes)).to.equal(true);
    });
        
    it('invalid composite operator' , function(){
        //id, price, quantity, name
        const query: any = {
            type: "composite",
            operator: "badOperator",
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
        const predRes: Result<iPredicate> = PredicateParser.parse(query);
        expect(isFailure(predRes)).to.equal(true);
    });

    it('number for composite operator' , function(){
        //id, price, quantity, name
        const query: any = {
            type: "composite",
            operator: 1,
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
        const predRes: Result<iPredicate> = PredicateParser.parse(query);
        expect(isFailure(predRes)).to.equal(true);
    });


    it('no type in simple predicate' , function(){
        //id, price, quantity, name
        const query: any = {
            operator: ">",
            operand1: 1,
            operand2: 0
        };
        const predRes: Result<iPredicate> = PredicateParser.parse(query);
        expect(isFailure(predRes)).to.equal(true);
    });

    it('no operator in simple predicate' , function(){
        //id, price, quantity, name
        const query: any = {
            type: "simple",
            operand1: 1,
            operand2: 0
        };
        const predRes: Result<iPredicate> = PredicateParser.parse(query);
        expect(isFailure(predRes)).to.equal(true);
    });

    it('no operand1 in simple predicate' , function(){
        //id, price, quantity, name
        const query: any = {
            type: "simple",
            operator: ">",
            operand2: 0
        };
        const predRes: Result<iPredicate> = PredicateParser.parse(query);
        expect(isFailure(predRes)).to.equal(true);
    });

    it('no operand2 in simple predicate' , function(){
        //id, price, quantity, name
        const query: any = {
            type: "simple",
            operator: ">",
            operand1: 1,
        };
        const predRes: Result<iPredicate> = PredicateParser.parse(query);
        expect(isFailure(predRes)).to.equal(true);
    });


    it('no type composite predicate' , function(){
        //id, price, quantity, name
        const query: any = {
            operator: 1,
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
        const predRes: Result<iPredicate> = PredicateParser.parse(query);
        expect(isFailure(predRes)).to.equal(true);
    });

    it('no operator in composite predicate' , function(){
        //id, price, quantity, name
        const query: any = {
            type: "composite",
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
        const predRes: Result<iPredicate> = PredicateParser.parse(query);
        expect(isFailure(predRes)).to.equal(true);
    });

    it('no operand in composite predicate' , function(){
        //id, price, quantity, name
        const query: any = {
            type: "composite",
            operator: 1
        };  
        const predRes: Result<iPredicate> = PredicateParser.parse(query);
        expect(isFailure(predRes)).to.equal(true);
    });

    it('empty operands in composite predicate' , function(){
        //id, price, quantity, name
        const query: any = {
            type: "composite",
            operator: 1,
            operands:[]  
        };  
        const predRes: Result<iPredicate> = PredicateParser.parse(query);
        expect(isFailure(predRes)).to.equal(true);
    });

    it('only 1 operand composite predicate' , function(){
        //id, price, quantity, name
        const query: any = {
            type: "composite",
            operator: 1,
            operands:[
                {
                    type: "simple",
                    operator: ">",
                    operand1: 2,
                    operand2: 1
                }
            ]
        };  
        const predRes: Result<iPredicate> = PredicateParser.parse(query);
        expect(isFailure(predRes)).to.equal(true);
    });

    it('non array arg for operands' , function(){
        //id, price, quantity, name
        const query: any = {
            type: "composite",
            operator: 1,
            operands: false
        };  
        const predRes: Result<iPredicate> = PredicateParser.parse(query);
        expect(isFailure(predRes)).to.equal(true);
    });

    it('composite predicate with invalid child' , function(){
        //id, price, quantity, name
        const query: any = {
            type: "composite",
            operator: 1,
            operands:[
                {
                    type: "simple",
                    operator: ">",
                    operand1: 2,
                    operand2: 1
                },
                {
                    operator: ">",
                    operand1: 4,
                    operand2: 3
                }
            ]
        };  
        const predRes: Result<iPredicate> = PredicateParser.parse(query);
        expect(isFailure(predRes)).to.equal(true);
    });

    it('invalid field simple predicate' , function(){
        //id, price, quantity, name
        const query: any = {
            type: "simple",
            operator: ">",
            operand1: "badField",
            operand2: 0
        };
        const basket: iSubject = new MyBasket();     
        const predRes: Result<iPredicate> = PredicateParser.parse(query);
        expect(isOk(predRes)).to.equal(true);
        if(isOk(predRes)){
            const satRes: Result<boolean> = predRes.value.isSatisfied(basket);
            expect(isFailure(satRes)).to.equal(true);
        }
    });

    it('invalid field composite predicate' , function(){
        //id, price, quantity, name
        const query: any = {
            type: "composite",
            operator: "or",
            operands:[
                {
                    type: "simple",
                    operator: "<",
                    operand1: "badField",
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
            const satRes: Result<boolean> = predRes.value.isSatisfied(basket);
            expect(isFailure(satRes)).to.equal(true);
        }
    });

});

