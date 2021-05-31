import { assert, expect } from 'chai';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isFailure, isOk, Result } from '../../src/Result';
import { SystemFacade } from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { register_login, open_store, register_login_with_age } from './common';
import { APIsWillSucceed, failIfRejected, failIfResolved } from '../testUtil';
import { tCompositePredicate, tPredicate, tSimplePredicate } from '../../src/DomainLayer/discount/logic/Predicate';

describe('4.5:Appoint manager tests', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
        APIsWillSucceed();
    });

    afterEach(function () {
        service.clear();
    });

    //child should succeed, adult should fail
    it('only kids can buy toys (category)', async function () {
        let avi_sessionId = await service.enter();
        let child_sessionId = await service.enter();
        let adult_sessionId = await service.enter();
        let avi = await register_login(service,avi_sessionId, "avi", "123456789");
        let child = await register_login_with_age(service,child_sessionId, "tbaby", "123456789", 7);
        let adult = await register_login_with_age(service,adult_sessionId, "moshe", "123456789", 22);
        let store = await open_store(service, avi_sessionId,avi, "Mega", 123456, "Tel Aviv");
        const storeId: number = store.getStoreId();
        await service.addCategoryToRoot(avi_sessionId,storeId, "toys")
        const legoId = await service.addNewProduct(avi_sessionId, storeId, "lego", ["toys"], 10, 1000);
        const pred:tCompositePredicate = {
            type: "composite",
            operator: "=>",
            operands: [
                {
                    type:"simple",
                    operand1:"b_toys_quantity",
                    operator:">",
                    operand2:0
                },
                {
                    type:"simple",
                    operand1:"u_age",
                    operator:"<",
                    operand2:18
                }
            ]
        }
        await service.addBuyingPolicy(avi_sessionId, storeId, "only kids can buy toys",pred );
        await service.addProductTocart(child_sessionId,storeId, legoId,5);
        await service.addProductTocart(adult_sessionId,storeId, legoId,5);

        await service.checkoutBasket(child_sessionId, storeId, "8 Mile")
        await failIfResolved(()=>service.checkoutBasket(adult_sessionId, storeId, "8 Mile"))
    })

    //checkout should be allowed with 1 playstation and then fail when he tries to checkout with 2
    it('cant buy more than 1 playstation (product)', async function () {
        let avi_sessionId = await service.enter();
        let moshe_sessionId = await service.enter();
        let avi = await register_login(service,avi_sessionId, "avi", "123456789");
        let moshe = await register_login_with_age(service,moshe_sessionId, "tbaby", "123456789", 25);
        let store = await open_store(service, avi_sessionId,avi, "Mega", 123456, "Tel Aviv");
        const storeId: number = store.getStoreId();
        const playstationId = await service.addNewProduct(avi_sessionId, storeId, "playstation", [], 10, 1000);
        const pred:tSimplePredicate = {
            type:"simple",
            operand1:`b_${playstationId}_quantity`,
            operator:"<",
            operand2:2
        }
        await service.addBuyingPolicy(avi_sessionId, storeId, "max 1 playstation per customer",pred );
        await service.addProductTocart(moshe_sessionId,storeId, playstationId, 1);
        await service.checkoutBasket(moshe_sessionId, storeId, "8 Mile");
        await service.editCart(moshe_sessionId,storeId,playstationId,2);
        await failIfResolved(() => service.checkoutBasket(moshe_sessionId, storeId, "8 Mile"))
    })

});