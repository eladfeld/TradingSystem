import { expect } from 'chai';
import {iPredicate} from '../../../src/DomainLayer/discount/logic/Predicate';
import PredicateParser from '../../../src/DomainLayer/discount/logic/parser';
import { isFailure, Result } from '../../../src/Result';

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



});

