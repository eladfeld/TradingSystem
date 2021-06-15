import {assert, expect} from 'chai';
import { Store } from '../../src/DomainLayer/store/Store';
import { Login } from '../../src/DomainLayer/user/Login';
import { Service } from '../../src/ServiceLayer/Service';
import { tPaymentInfo, tShippingInfo } from '../../src/DomainLayer/purchase/Purchase';


const payInfo : tPaymentInfo = { holder: "Rick" , id:244, cardNumber:123, expMonth:5, expYear:2024, cvv:123, toAccount: 1, amount: 100};

const shippingInfo: tShippingInfo = {name:"Rick", address:"kineret", city:"jerusalem", country:"israel", zip:8727};

import { APIsWillSucceed, failIfRejected, uniqueName } from '../testUtil';
import {setReady, waitToRun} from '../testUtil';
import { Offer, OfferStatus } from '../../src/DomainLayer/offer/Offer';
import { OfferManager } from '../../src/DomainLayer/offer/OfferManager';
import { DB } from '../../src/DataAccessLayer/DBfacade';
import { MakeAppointment } from '../../src/DomainLayer/user/MakeAppointment';
import { Register } from '../../src/DomainLayer/user/Register';

describe('set store recieve offers' , () => {

    beforeEach( () => {
        return waitToRun(()=>APIsWillSucceed());
    });

    afterEach(function () {
        setReady(true);
    });

    it('store should not recieve offers', async() => {
        let service = await Service.get_instance();
        let offerManager = OfferManager.get_instance();
        let sess = await service.enter();
        let manager = await service.login(sess, "michael", '1234')
        let storep = service.openStore(sess, 'alon store', 123, 'beer sheva')
        await storep.then( store => {
            return offerManager.isRecievingOffers(store.getStoreId())
        }).then( res => {
            expect(res).to.equal(false)
        }).catch(err => expect(err).to.equal(false))
    })

    it('set store to recieve offers', async() => {
        let service = await Service.get_instance();
        let offerManager = OfferManager.get_instance();
        let manager = await Login.login("michael", '1234')
        let storep = DB.getStoreByName('alon store')
        let storeId = 0;
        return storep.then( store => {
            storeId = store.getStoreId();
            return offerManager.setStoreToRecieveOffers(storeId)
        }).then( _ => {
            return offerManager.isRecievingOffers(storeId)
        }).then( res => {
            expect(res).to.equal(true)
        }).catch(err => expect(err).to.equal(false))
    })

    it('set store to not recieve offers', async() => {
        let service = await Service.get_instance();
        let offerManager = OfferManager.get_instance();
        let manager = await Login.login("michael", '1234')
        let storep = DB.getStoreByName('alon store')
        let storeId = 0;
        return storep.then( store => {
            storeId = store.getStoreId();
            return offerManager.setStoreToNotRecieveOffers(storeId)
        }).then( _ => {
            return offerManager.isRecievingOffers(storeId)
        }).then( res => {
            expect(res).to.equal(false)
        }).catch(err => expect(err).to.equal(false))
    })



});

describe('create and accept offers' , () => {

    beforeEach( () => {
        return waitToRun(()=>APIsWillSucceed());
    });

    afterEach(function () {
        setReady(true);
    });

    it('create and get offer', async() => {
        let service = await Service.get_instance();
        let offerManager = OfferManager.get_instance();
        let manager = await Login.login("michael", '1234')
        let storep = DB.getStoreByName('alon store')
        let storeId = 0;
        let storeFromDB: Store;
        return storep.then( store => {
            storeFromDB = store;
            storeId = store.getStoreId();
            return offerManager.setStoreToRecieveOffers(storeId)
        }).then( _ => {
            return storeFromDB.addNewProduct(manager, 'shirt', [], 100, 100, '')
        }).then( spId => {
            return DB.getProductById(spId);
        }).then( product => {
            return offerManager.newOffer(manager, storeId, product, 300)
        }).then( id => {
            return DB.getOfferById(id)
        }).then( off => {
            expect(off.getBid()).to.equal(300)
            expect(off.getOfferStatus()).to.equal(OfferStatus.PENDING)
            expect(off.getProductName()).to.equal('shirt')
            expect(off.getUsername()).to.equal('michael')
        }).catch(err => expect(err).to.equal(true))
    })

    it('accept offer', async() => {
        let service = await Service.get_instance();
        let offerManager = OfferManager.get_instance();
        let manager = await Login.login("michael", '1234')
        await Register.register('alon', 'shhh', 25)
        let owner = await Login.login("alon", 'shhh')
        let storep = DB.getStoreByName('alon store')
        let storeId = 0;
        let offId = 0;
        let storeFromDB: Store;
        return storep.then( store => {
            storeFromDB = store;
            storeId = store.getStoreId();
            return MakeAppointment.appoint_owner(manager, store, owner)
        }).then( _ => {
            return offerManager.setStoreToRecieveOffers(storeId)
        }).then( _ => {
            return storeFromDB.addNewProduct(manager, 'pants', [], 100, 100, '')
        }).then( spId => {
            return DB.getProductById(spId);
        }).then( product => {
            return offerManager.newOffer(manager, storeId, product, 300);
        }).then( offerId => {
            offId = offerId;
            return offerManager.acceptOffer(manager, storeFromDB, offerId)
        }).then( _ => {
            return DB.getOfferById(offId)
        }).then( off => {
            expect(off.getBid()).to.equal(300)
            expect(off.getOfferStatus()).to.equal(OfferStatus.PENDING)
            expect(off.getProductName()).to.equal('pants')
            expect(off.getUsername()).to.equal('michael')
        }).then( _ => {
            return offerManager.acceptOffer(owner, storeFromDB, offId)
        }).then( _ => {
            return DB.getOfferById(offId)
        }).then( off => {
            expect(off.getBid()).to.equal(300)
            expect(off.getOfferStatus()).to.equal(OfferStatus.ACCEPTED)
            expect(off.getProductName()).to.equal('pants')
            expect(off.getUsername()).to.equal('michael')
        }).catch(err => expect(err.message).to.equal(true))
    })

});
