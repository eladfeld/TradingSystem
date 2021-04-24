import { assert, expect } from 'chai';
import { Category } from '../../src/DomainLayer/store/Common';
import { Product } from '../../src/DomainLayer/store/Product';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import { SystemFacade } from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { add_product, enter_register_login, open_store } from './common';

describe('4.1: edit store inventory', function () {
    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
        Authentication.clean();
    });

    it('edit non existent product ', function () {
        let avi = enter_register_login(service, "avi", "123456789")
        let store = open_store(service, avi, "Aluf Hasport", 123456, "Tel Aviv");
        let product1: Product = new Product("banana", [Category.SWEET]);
        expect(isOk(service.editStoreInventory(avi.getUserId(), store.getStoreId(), product1.getProductId(), 10))).to.equal(false);
    })

    it('edit existing product', function () {
        let avi = enter_register_login(service, "avi", "123456789")
        let store = open_store(service, avi, "Aluf Hasport", 123456, "Tel Aviv");
        let banana = add_product(service, avi, store, "banana", [Category.SWEET], 12, 100);
        expect(isOk(service.editStoreInventory(avi.getUserId(), store.getStoreId(), banana, 10))).to.equal(true);


    })





});