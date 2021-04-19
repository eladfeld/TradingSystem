import {expect} from 'chai';
import { DiscountOption } from '../../../src/DomainLayer/store/DiscountOption';
import { DiscountPolicy } from '../../../src/DomainLayer/store/DiscountPolicy';
import { Store } from '../../../src/DomainLayer/store/Store';


describe('discount policy tests' , () => {

    it('create a store without discount policy', () => {
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
        expect(store.getDiscountPolicy().getDiscountPolicy()).to.equal(DiscountPolicy.default)
    })

    it('create a store with discount policy and apply discount', () => {
        let discountPolicy = new DiscountPolicy()
        let discount = new DiscountOption(30, new Date(2010, 12, 12, 10, 10, 10), new Date(2030, 12, 12, 10, 10, 10))
        discountPolicy.addDiscount(discount)
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb', discountPolicy)
        discountPolicy = store.getDiscountPolicy()
        let productMap = new Map<number, number>()
        productMap.set(100, 10)
        expect(discountPolicy.applyDiscountPolicy(productMap)).to.equal(70*10)
    })

});