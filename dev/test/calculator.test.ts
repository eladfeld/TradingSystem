import {expect} from 'chai';
import {Calculator} from '../src/DomainLayer/Calculator'

describe('add' , function() {
    var calculator = new Calculator();
    it('1+1=2', function(){
        
        expect(calculator.add(1,2)).to.equal(3);
    })

    it('bad add' , function ()
    {
        expect(calculator.add(1,2)).not.equal(4);
    });


});