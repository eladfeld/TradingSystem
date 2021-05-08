
import {expect} from 'chai';
import {isOk, makeFailure, makeOk, Result} from '../src/Result'

describe('result' , function() {
    
    it('ok result test', function(){
        let res : Result<number> = makeOk(3);
        expect(isOk(res)).to.true;
    
})
    it('failure result test', function(){
        let res : Result<number> = makeFailure("not good");
        expect(isOk(res)).to.not.true;
    })

    it('ok value test', function(){
        let res : Result<number> = makeOk(3);
        isOk(res) ? expect(res.value).to.equal(3) :
        expect(0).to.equal(1);
    })

    it('failure message test', function(){
        let res : Result<number> = makeFailure("not good");
        !isOk(res) ? expect(res.message).to.equal("not good") :
        expect(0).to.equal(1);
    })

});
