import { assert, expect } from 'chai';
import { APIsWillSucceed, failIfResolved, uniqueAlufHasportName, uniqueAviName, uniqueName } from '../testUtil';

describe('6.4: System Manager Get Info', function () {

    beforeEach(function () {
        APIsWillSucceed();
    });

    afterEach(function () {
        //service.clear();
    });
    it('check 1',async  function () {
        await failIfResolved(()=> Promise.resolve())
    })

    it('check 2',async  function () {
        try{
            await failIfResolved(()=> Promise.resolve())
        }catch(e){ }
    })

    it('check 3',async  function () {
        await Promise.reject("no reason");
    })
});