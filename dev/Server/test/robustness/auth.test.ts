import { assert, expect } from 'chai';
import { DB } from '../../src/DataAccessLayer/DBfacade';
import PaymentSystem from '../../src/DomainLayer/apis/PaymentSystem';
import SupplySystem from '../../src/DomainLayer/apis/SupplySystem';
import PaymentInfo from '../../src/DomainLayer/purchase/PaymentInfo';
import Purchase from '../../src/DomainLayer/purchase/Purchase';
import { Service } from '../../src/ServiceLayer/Service';
import { register_login, open_store, SHIPPING_INFO, PAYMENT_INFO } from '../acceptence/common';
import {APIsWillSucceed, failIfResolved, uniqueAviName, uniqueMegaName} from '../testUtil';
import {setReady, waitToRun} from '../testUtil';

describe('Auth fail',async function () {

    var service: Service =await Service.get_instance();
    beforeEach( () => {
        //console.log('start')
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        //console.log('finish');        
        setReady(true);
    });

    /*
    ************ subscriber DB *******************
    */
    it('subscriber db fails on register', async function () {
        let avi_sessionId = await service.enter()
        DB.willFail();
        const aviName = uniqueAviName();
        await failIfResolved(() => service.register(aviName,"123",25))
        DB.willSucceed();
        await service.register(aviName,"123",25);
    });

    it('subscriber db fails on login', async function () {
        let avi_sessionId = await service.enter()
        const aviName = uniqueAviName();
        await service.register(aviName,"123",25);
        DB.willFail();
        await failIfResolved(()=> service.login(avi_sessionId,aviName,"123"))
        DB.willSucceed();
        await service.login(avi_sessionId,aviName,"123")
    });

    /*
    ************ Store DB *******************
    */
    it('store db fails on appointing manager', async function () {
        expect(true).to.equal(false)
    });

    it('store db fails on adding new product', async function () {
        expect(true).to.equal(false)
    });

    /*
    ************ Purchase DB *******************
    */
    it('purchase db fails on fetch transactions', async function () {
        expect(true).to.equal(false)
    });

    it('purchase db fails on checkout', async function () {
        expect(true).to.equal(false)
    });

    it('purchase db fails on complete order', async function () {
        expect(true).to.equal(false)
    });
   
});