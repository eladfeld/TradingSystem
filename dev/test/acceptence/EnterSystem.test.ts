import {expect} from 'chai';
import { isOk, Result } from '../../src/Result';
import {Service} from '../../src/ServiceLayer/Service'

describe('enter system test' , function() {

    it('guest user enter system' , function() {
        let service: Service = Service.get_instance();
        service.clear();
        let res: Result<number> = service.enter()
        expect(isOk(res) ? res.value : res.message).to.greaterThanOrEqual(0);
    })

    it('enter 3 users' , function() {
        let service: Service = Service.get_instance();
        service.clear();
        let res1: Result<number> = service.enter()
        let res2: Result<number> = service.enter()
        let res3: Result<number> = service.enter()
        if(isOk(res1) && isOk(res2) && isOk(res3))
        {
            expect(res1.value !== res2.value && res1.value!==res3.value && res2.value!==res3.value);
        }   
    })

    describe('exit system test' , function() {

        it('enter 3 users and exit 1' , function() {
            let service: Service = Service.get_instance();
            service.clear();
            let res1: Result<number> = service.enter()
            let res2: Result<number> = service.enter()
            let res3: Result<number> = service.enter()
            
            if(isOk(res1) && isOk(res2) && isOk(res3))
            {
                service.exit(res2.value);
                expect(service.getLoggedUsers().length).to.equal(2);
            }   
        })

        it('fail exit' , function() {
            let service: Service = Service.get_instance();
            service.clear();
            service.enter();
            service.exit(5);
            expect(service.getLoggedUsers().length).to.equal(1);
            
        })

    })

});