import {expect} from 'chai';
import { BuyingOption, buyingOption } from '../../../src/DomainLayer/store/BuyingOption';
import { BuyingPolicy } from '../../../src/DomainLayer/store/BuyingPolicy';
import { DiscountPolicy } from '../../../src/DomainLayer/store/DiscountPolicy';
import { Store } from '../../../src/DomainLayer/store/Store';


describe('buying policy tests' , () => {

    it('create a store without buying policy', function(){
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
        let buyingPolicy = store.getBuyingPolicy()
        expect(buyingPolicy.hasBuyingOption(buyingOption.INSTANT)).to.equal(true)
        expect(buyingPolicy.hasBuyingOption(buyingOption.BID)).to.equal(false)
        expect(buyingPolicy.hasBuyingOption(buyingOption.OFFER)).to.equal(false)
        expect(buyingPolicy.hasBuyingOption(buyingOption.RAFFLE)).to.equal(false)
    })

    it('create a store with buying policy', function(){
        let buyingPolicy = new BuyingPolicy()
        let bidOption = new BuyingOption()
        bidOption.setBuyingOption(buyingOption.BID)
        let offerOption = new BuyingOption()
        offerOption.setBuyingOption(buyingOption.OFFER)
        buyingPolicy.setBuyingOptions([bidOption, offerOption])
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb', undefined, buyingPolicy)
        buyingPolicy = store.getBuyingPolicy()
        expect(buyingPolicy.hasBuyingOption(buyingOption.INSTANT)).to.equal(false)
        expect(buyingPolicy.hasBuyingOption(buyingOption.BID)).to.equal(true)
        expect(buyingPolicy.hasBuyingOption(buyingOption.OFFER)).to.equal(true)
        expect(buyingPolicy.hasBuyingOption(buyingOption.RAFFLE)).to.equal(false)
        expect(store.getDiscountPolicy().getDiscountPolicy()).to.equal(DiscountPolicy.default)
    })

});