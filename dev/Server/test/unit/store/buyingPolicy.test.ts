import {expect} from 'chai';
import { buyingOption } from '../../../src/DomainLayer/store/BuyingOption';
import { DiscountPolicy } from '../../../src/DomainLayer/store/DiscountPolicy';
import { Store } from '../../../src/DomainLayer/store/Store';


describe('buying policy tests' , () => {

    it('create a store without buying policy', function(){
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
        expect(store.hasBuyingOption(buyingOption.INSTANT)).to.equal(true)
        expect(store.hasBuyingOption(buyingOption.BID)).to.equal(false)
        expect(store.hasBuyingOption(buyingOption.OFFER)).to.equal(false)
        expect(store.hasBuyingOption(buyingOption.RAFFLE)).to.equal(false)
    })

    it('create a store with buying policy', function(){
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
        store.addBuyingOption(buyingOption.BID)
        store.addBuyingOption(buyingOption.OFFER)
        store.deleteBuyingOption(buyingOption.INSTANT)
        expect(store.hasBuyingOption(buyingOption.INSTANT)).to.equal(false)
        expect(store.hasBuyingOption(buyingOption.BID)).to.equal(true)
        expect(store.hasBuyingOption(buyingOption.OFFER)).to.equal(true)
        expect(store.hasBuyingOption(buyingOption.RAFFLE)).to.equal(false)
        expect(store.getDiscountPolicy().getDiscountPolicy()).to.equal(DiscountPolicy.default)
    })

});