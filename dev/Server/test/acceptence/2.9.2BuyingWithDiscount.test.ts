import { assert, expect } from 'chai';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isFailure, isOk, Result } from '../../src/Result';
import { SystemFacade } from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { register_login, open_store, register_login_with_age, PAYMENT_INFO, SHIPPING_INFO } from './common';
import { APIsWillSucceed, failIfRejected, failIfResolved, uniqueAviName, uniqueMegaName, uniqueName, uniqueMosheName } from '../testUtil';
import { tCompositePredicate, tPredicate, tSimplePredicate } from '../../src/DomainLayer/discount/logic/Predicate';
import { tConditionalDiscount, tUnconditionalDiscount } from '../../src/DomainLayer/discount/Discount';
import PaymentInfo from '../../src/DomainLayer/purchase/PaymentInfo';
import Transaction from '../../src/DomainLayer/purchase/Transaction';
import {setReady, waitToRun} from '../testUtil';

describe('2.9.2 Buying with discount', function () {

    var service: Service = Service.get_instance();
    beforeEach( () => {
        //console.log('start')
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        //console.log('finish');        
        setReady(true);
    });

    //child should succeed, adult should fail
    it('10% off toys category', async function () {
        let avi_sessionId = await service.enter();
        let moshe_sessionId = await service.enter();
        let avi = await register_login(service,avi_sessionId, uniqueAviName(), "123456789");
        await register_login_with_age(service,moshe_sessionId, uniqueName("tbaby"), "123456789", 7);
        let store = await open_store(service, avi_sessionId,avi, uniqueMegaName(), 123456, "Tel Aviv");
        const storeId: number = store.getStoreId();
        await service.addCategoryToRoot(avi_sessionId,storeId, "toys")
        const legoId = await service.addNewProduct(avi_sessionId, storeId, "lego", ["toys"], 10, 1000);

        const discount:tUnconditionalDiscount = {
            type:"unconditional",
            category:"toys",
            ratio:0.1
        }
        await service.addDiscountPolicy(avi_sessionId,storeId,"10% off toys",discount);
        await service.addProductTocart(moshe_sessionId,storeId, legoId,10);

        await service.checkoutBasket(moshe_sessionId, storeId, SHIPPING_INFO);
        await service.completeOrder(moshe_sessionId,storeId,PAYMENT_INFO,SHIPPING_INFO);
        const mosheHistoryStr = await service.getMyPurchaseHistory(moshe_sessionId);
        const mosheHistory = JSON.parse(mosheHistoryStr);
        expect(mosheHistory.length).to.equal(1);
        const t: any = mosheHistory[0];
        expect(t.total).to.equal(90);

    })

    it('10% off toys category if you buy at least 10 toys', async function () {
        let avi_sessionId = await service.enter();
        let moshe_sessionId = await service.enter();
        let al_sessionId = await service.enter();

        let avi = await register_login(service,avi_sessionId, uniqueAviName(), "123456789");
        await register_login_with_age(service,moshe_sessionId, uniqueMosheName(), "123456789", 7);
        await register_login_with_age(service,al_sessionId, uniqueName("al"), "123456789", 7);
        let store = await open_store(service, avi_sessionId,avi, uniqueMegaName(), 123456, "Tel Aviv");
        const storeId: number = store.getStoreId();
        await service.addCategoryToRoot(avi_sessionId,storeId, "toys")
        const legoId = await service.addNewProduct(avi_sessionId, storeId, "lego", ["toys"], 10, 1000);

        const discount:tConditionalDiscount = {
            type:"conditional",
            category:"toys",
            ratio:0.1,
            predicate:{
                type:"simple",
                operand1:`toys_quantity`,
                operator:">",
                operand2:9
            }
        }
        await service.addDiscountPolicy(avi_sessionId,storeId,"10% off toys if at least 10 toys",discount);

        //moshe should get discount but al shouldnt
        await service.addProductTocart(moshe_sessionId,storeId, legoId,10);
        await service.checkoutBasket(moshe_sessionId, storeId, SHIPPING_INFO);
        await service.completeOrder(moshe_sessionId,storeId,PAYMENT_INFO,SHIPPING_INFO);
        const mosheHistoryStr = await service.getMyPurchaseHistory(moshe_sessionId);
        const mosheHistory = JSON.parse(mosheHistoryStr);
        expect(mosheHistory.length).to.equal(1);
        const t_moshe: any = mosheHistory[0];
        expect(t_moshe.total).to.equal(90);

        await service.addProductTocart(al_sessionId,storeId, legoId,5);
        await service.checkoutBasket(al_sessionId, storeId, SHIPPING_INFO);
        await service.completeOrder(al_sessionId,storeId,PAYMENT_INFO,SHIPPING_INFO);
        const alHistoryStr = await service.getMyPurchaseHistory(al_sessionId);
        const alHistory = JSON.parse(alHistoryStr);
        expect(alHistory.length).to.equal(1);
        const t_al: any = mosheHistory[0];
        expect(t_al.total).to.equal(90);

    })



});