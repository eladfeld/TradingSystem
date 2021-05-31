import { assert, expect } from 'chai';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isFailure, isOk, Result } from '../../src/Result';
import { SystemFacade } from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { register_login, open_store, register_login_with_age, PAYMENT_INFO, SHIPPING_INFO } from './common';
import { APIsWillSucceed, failIfRejected, failIfResolved } from '../testUtil';
import { tCompositePredicate, tPredicate, tSimplePredicate } from '../../src/DomainLayer/discount/logic/Predicate';
import { tConditionalDiscount, tUnconditionalDiscount } from '../../src/DomainLayer/discount/Discount';
import PaymentInfo from '../../src/DomainLayer/purchase/PaymentInfo';
import Transaction from '../../src/DomainLayer/purchase/Transaction';

describe('4.5:Appoint manager tests', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
        APIsWillSucceed();
    });

    afterEach(function () {
        service.clear();
    });

    //child should succeed, adult should fail
    it('10% off toys category', async function () {
        let avi_sessionId = await service.enter();
        let moshe_sessionId = await service.enter();
        let avi = await register_login(service,avi_sessionId, "avi", "123456789");
        await register_login_with_age(service,moshe_sessionId, "tbaby", "123456789", 7);
        let store = await open_store(service, avi_sessionId,avi, "Mega", 123456, "Tel Aviv");
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

        await service.checkoutBasket(moshe_sessionId, storeId, "8 Mile");
        await service.completeOrder(moshe_sessionId,storeId,PAYMENT_INFO,SHIPPING_INFO);
        const mosheHistoryStr = await service.getMyPurchaseHistory(moshe_sessionId);
        const mosheHistory = JSON.parse(mosheHistoryStr);
        expect(mosheHistory.length).to.equal(1);
        const t: Transaction = mosheHistory[0];
        expect(t.getTotal()).to.equal(90);

    })

    it('10% off toys category if you buy at least 10 toys', async function () {
        let avi_sessionId = await service.enter();
        let moshe_sessionId = await service.enter();
        let al_sessionId = await service.enter();

        let avi = await register_login(service,avi_sessionId, "avi", "123456789");
        await register_login_with_age(service,moshe_sessionId, "moshe", "123456789", 7);
        await register_login_with_age(service,al_sessionId, "al", "123456789", 7);
        let store = await open_store(service, avi_sessionId,avi, "Mega", 123456, "Tel Aviv");
        const storeId: number = store.getStoreId();
        await service.addCategoryToRoot(avi_sessionId,storeId, "toys")
        const legoId = await service.addNewProduct(avi_sessionId, storeId, "lego", ["toys"], 10, 1000);

        const discount:tConditionalDiscount = {
            type:"conditional",
            category:"toys",
            ratio:0.1,
            predicate:{
                type:"simple",
                operand1:`b_toys_quantity`,
                operator:">",
                operand2:9
            }
        }
        await service.addDiscountPolicy(avi_sessionId,storeId,"10% off toys if at least 10 toys",discount);

        //moshe should get discount but al shouldnt
        await service.addProductTocart(moshe_sessionId,storeId, legoId,10);
        await service.checkoutBasket(moshe_sessionId, storeId, "8 Mile");
        await service.completeOrder(moshe_sessionId,storeId,PAYMENT_INFO,SHIPPING_INFO);
        const mosheHistoryStr = await service.getMyPurchaseHistory(moshe_sessionId);
        const mosheHistory = JSON.parse(mosheHistoryStr);
        expect(mosheHistory.length).to.equal(1);
        const t_moshe: Transaction = mosheHistory[0];
        expect(t_moshe.getTotal()).to.equal(90);

        await service.addProductTocart(al_sessionId,storeId, legoId,5);
        await service.checkoutBasket(al_sessionId, storeId, "8 Mile");
        await service.completeOrder(al_sessionId,storeId,PAYMENT_INFO,SHIPPING_INFO);
        const alHistoryStr = await service.getMyPurchaseHistory(al_sessionId);
        const alHistory = JSON.parse(alHistoryStr);
        expect(alHistory.length).to.equal(1);
        const t_al: Transaction = mosheHistory[0];
        expect(t_al.getTotal()).to.equal(90);

    })



});