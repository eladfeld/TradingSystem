import {expect} from 'chai';
import { Store } from '../../src/DomainLayer/store/Store';
import { Appointment, JobTitle } from '../../src/DomainLayer/user/Appointment';
import { ACTION, Permission } from '../../src/DomainLayer/user/Permission';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { StoreStub } from './StoreStub';

describe('appointment tests' , function() {
    it('appoint manager', function(){
        let store : Store = new StoreStub(111);
        store.setStoreId(444);
        let subscriber1 : Subscriber = new Subscriber("micha");
        let subscriber2 : Subscriber = new Subscriber("micha");
        let appointment1 : Appointment = new Appointment(subscriber1,store,subscriber1,new Permission(1 | 2) , JobTitle.FOUNDER);
        subscriber1.addAppointment(appointment1); //inject subscriber 1 appoinment as founder
        expect(Appointment.appoint_manager(subscriber1,store,subscriber2,new Permission(0)).isOk()).to.equal(true);
    })

    it('appoint manager without permissions', function(){
        let store : Store = new StoreStub(111);
        store.setStoreId(444);
        let subscriber1 : Subscriber = new Subscriber("micha");
        let subscriber2 : Subscriber = new Subscriber("micha");
        let appointment1 : Appointment = new Appointment(subscriber1,store,subscriber1,new Permission(1 | 2) , JobTitle.FOUNDER);
        expect(Appointment.appoint_manager(subscriber1,store,subscriber2,new Permission(0)).isOk()).to.equal(false);
    })

    it('try to reappoint user', function(){
        let store : Store = new StoreStub(111);
        store.setStoreId(444);
        let subscriber1 : Subscriber = new Subscriber("micha");
        let subscriber2 : Subscriber = new Subscriber("micha");
        let appointment1 : Appointment = new Appointment(subscriber1,store,subscriber1,new Permission(1 | 2) , JobTitle.FOUNDER);
        subscriber1.addAppointment(appointment1); //inject subscriber 1 appoinment as founder
        Appointment.appoint_manager(subscriber1,store,subscriber2,new Permission(0));
        expect(Appointment.appoint_manager(subscriber1,store,subscriber2,new Permission(0)).isOk()).to.equal(false);
    })



});