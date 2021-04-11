
import {expect} from 'chai';
import {Result} from '../src/Result'

describe('result' , function() {
    
    it('ok result test', function(){
        let res : Result<number> = Result.makeOk(3);
        expect(res.isOk()).to.true;
    
})
    it('failure result test', function(){
        let res : Result<number> = Result.makeFailure("not good");
        expect(res.isOk()).to.not.true;
    })

    it('ok value test', function(){
        let res : Result<number> = Result.makeOk(3);
        expect(res.getValue()).to.equal(3);
    })

    it('failure message test', function(){
        let res : Result<number> = Result.makeFailure("not good");
        expect(res.getMessage()).to.equal("not good");
    })

});
