import {expect} from 'chai';
import { Store } from '../../src/DomainLayer/store/Store';
import { Appointment, JobTitle } from '../../src/DomainLayer/user/Appointment';
import { ACTION, Permission } from '../../src/DomainLayer/user/Permission';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { StoreStub } from './StoreStub';

describe('subscriber tests' , function() {
    it('add appointment test', function(){
        //this test has no logic just to check that add appointment works
        let store : Store = new StoreStub(123);
        let subscriber1 : Subscriber = new Subscriber("micha");
        let appointment1 : Appointment = new Appointment(subscriber1,store,subscriber1,new Permission(0),JobTitle.OWNER);
        subscriber1.addAppointment(appointment1);
        subscriber1.addAppointment(appointment1);
        expect(subscriber1.getAppointments().length).to.equal(2);
    })
    
    it('delete appointment test', function(){
        //this test has no logic just to check that delete appointment works
        let store : Store = new StoreStub(123);
        let subscriber1 : Subscriber = new Subscriber("micha");
        let subscriber2 : Subscriber = new Subscriber("elad");
        let appointment1 : Appointment = new Appointment(subscriber1,store,subscriber2,new Permission(0),JobTitle.OWNER);
        let appointment2 : Appointment = new Appointment(subscriber2,store,subscriber2,new Permission(0),JobTitle.MANAGER);
        subscriber1.addAppointment(appointment1);
        subscriber1.addAppointment(appointment2);
        subscriber1.deleteAppointment(appointment1);
        expect(subscriber1.getAppointments().length).to.equal(1);
    })

    it('get title test', function(){
        let store : Store = new StoreStub(123);
        store.setStoreId(444);
        let subscriber1 : Subscriber = new Subscriber("micha");
        let appointment1 : Appointment = new Appointment(subscriber1,store,subscriber1,new Permission(0),JobTitle.OWNER);
        subscriber1.addAppointment(appointment1);
        expect(subscriber1.getTitle(444)).to.equal(JobTitle.OWNER);
    })

    it('check if permitted positive test', function(){
        let store : Store = new StoreStub(123);
        store.setStoreId(444);
        let subscriber1 : Subscriber = new Subscriber("micha");
        let appointment1 : Appointment = new Appointment(subscriber1,store,subscriber1,new Permission(ACTION.APPOINT_MANAGER),JobTitle.OWNER);
        subscriber1.addAppointment(appointment1);
        expect(subscriber1.checkIfPerrmited(ACTION.APPOINT_MANAGER,store)).to.equal(true);
    })

    it('check if permitted negative test', function(){
        let store : Store = new StoreStub(123);
        store.setStoreId(444);
        let subscriber1 : Subscriber = new Subscriber("micha");
        let appointment1 : Appointment = new Appointment(subscriber1,store,subscriber1,new Permission(ACTION.APPOINT_MANAGER),JobTitle.OWNER);
        subscriber1.addAppointment(appointment1);
        expect(subscriber1.checkIfPerrmited(ACTION.APPOINT_OWNER,store)).to.equal(false);
    })
    

});