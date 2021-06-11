import {expect} from 'chai';
import { Appointment } from '../../../src/DomainLayer/user/Appointment';
import { ManagerAppointment } from '../../../src/DomainLayer/user/ManagerAppointment';
import { OwnerAppointment } from '../../../src/DomainLayer/user/OwnerAppointment';
import { ACTION, Permission } from '../../../src/DomainLayer/user/Permission';
import { Subscriber } from '../../../src/DomainLayer/user/Subscriber';
import { APIsWillSucceed, HASHED_PASSWORD } from '../../testUtil';
import { StoreStub } from './StoreStub';
import {setReady, waitToRun} from '../../testUtil';

describe('subscriber tests' , function() {
    beforeEach( () => {
        //console.log('start')
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        //console.log('finish');        
        setReady(true);
    });
    it('add appointment test',function(){
        //this test has no logic just to check that add appointment works
        let store : StoreStub = new StoreStub(123,"Aluf Hasport" , 123456 , "Tel Aviv");
        let subscriber1 : Subscriber = new Subscriber("micha",HASHED_PASSWORD, 13);
        let appointment1 : Appointment = new OwnerAppointment(subscriber1.getUserId(),store.getStoreId(),subscriber1.getUserId(),new Permission(0));
        subscriber1.addAppointment(appointment1);
        subscriber1.addAppointment(appointment1);
        expect(subscriber1.getAppointments().length).to.equal(2);
    })
    
    it('delete appointment test',function(){
        //this test has no logic just to check that delete appointment works
        let store : StoreStub = new StoreStub(123,"Aluf Hasport" , 123456 , "Tel Aviv");
        let subscriber1 : Subscriber = new Subscriber("micha",HASHED_PASSWORD, 13);
        let subscriber2 : Subscriber = new Subscriber("elad",HASHED_PASSWORD, 13);
        let appointment1 : Appointment = new OwnerAppointment(subscriber1.getUserId(),store.getStoreId(),subscriber2.getUserId(),new Permission(0));
        let appointment2 : Appointment = new ManagerAppointment(subscriber2.getUserId(),store.getStoreId(),subscriber2.getUserId(),new Permission(0));
        subscriber1.addAppointment(appointment1);
        subscriber1.addAppointment(appointment2);
        subscriber1.deleteAppointment(appointment1);
        expect(subscriber1.getAppointments().length).to.equal(1);
    })

    it('get title test',function(){
        let store : StoreStub = new StoreStub(123,"Aluf Hasport" , 123456 , "Tel Aviv");
        store.setStoreId(444);
        let subscriber1 : Subscriber = new Subscriber("micha",HASHED_PASSWORD, 13);
        let appointment1 : Appointment = new OwnerAppointment(subscriber1.getUserId(),store.getStoreId(),subscriber1.getUserId(),new Permission(0));
        subscriber1.addAppointment(appointment1);
        expect(subscriber1.isOwner(444)).to.equal(true);
    })

    it('check if permitted positive test',function(){
        let store : StoreStub = new StoreStub(123,"Aluf Hasport" , 123456 , "Tel Aviv");
        store.setStoreId(444);
        let subscriber1 : Subscriber = new Subscriber("micha",HASHED_PASSWORD, 13);
        let appointment1 : Appointment = new OwnerAppointment(subscriber1.getUserId(),store.getStoreId(),subscriber1.getUserId(),new Permission(ACTION.APPOINT_MANAGER));
        subscriber1.addAppointment(appointment1);
        expect(subscriber1.checkIfPerrmited(ACTION.APPOINT_MANAGER,store)).to.equal(true);
    })

    it('check if permitted negative test',function(){
        let store : StoreStub = new StoreStub(123,"Aluf Hasport" , 123456 , "Tel Aviv");
        store.setStoreId(444);
        let subscriber1 : Subscriber = new Subscriber("micha",HASHED_PASSWORD, 13);
        let appointment1 : Appointment = new OwnerAppointment(subscriber1.getUserId(),store.getStoreId(),subscriber1.getUserId(),new Permission(ACTION.APPOINT_MANAGER));
        subscriber1.addAppointment(appointment1);
        expect(subscriber1.checkIfPerrmited(ACTION.APPOINT_OWNER,store)).to.equal(false);
    })
    

});