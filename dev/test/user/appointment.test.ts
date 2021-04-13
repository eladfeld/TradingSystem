import {expect} from 'chai';
import { Store } from '../../src/DomainLayer/store/Store';
import { Appointment, JobTitle } from '../../src/DomainLayer/user/Appointment';
import { ACTION, Permission } from '../../src/DomainLayer/user/Permission';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isOk } from '../../src/Result';
import { StoreStub } from './StoreStub';

describe('appointment tests' , function() {

    it('appoint founder' , function() {
        let founder : Subscriber = new Subscriber("micha");
        let store : Store = new StoreStub(founder.getUserId());
        expect(isOk(Appointment.appoint_founder(founder,store))).to.equal(true);
    })

    it('try to appoint someone who didnt open the store as founder', function(){
        let founder : Subscriber = new Subscriber("micha");
        let not_founder : Subscriber = new Subscriber("elad");
        let store : Store = new StoreStub(founder.getUserId());
        let appointment = Appointment.appoint_founder(not_founder,store);
        expect(isOk(appointment)).to.equal(false);
    })

    it('appoint manager', function(){
        let founder : Subscriber = new Subscriber("micha");
        let store : Store = new StoreStub(founder.getUserId());
        Appointment.appoint_founder(founder,store);   
        let manager : Subscriber = new Subscriber("micha");
        expect(isOk(Appointment.appoint_manager(founder,store,manager,new Permission(0)))).to.equal(true);
    })

    it('appoint manager without permissions', function(){
        let founder : Subscriber = new Subscriber("micha");
        let store : Store = new StoreStub(founder.getUserId());
        Appointment.appoint_founder(founder,store);  
        let manager : Subscriber = new Subscriber("elad");
        Appointment.appoint_manager(founder,store,manager,new Permission(0)); // no permissions
        let subscriber : Subscriber = new Subscriber("zuri");
        expect(isOk(Appointment.appoint_manager(manager,store,subscriber,new Permission(0)))).to.equal(false);
    })

    it('try to reappoint user', function(){
        let founder : Subscriber = new Subscriber("micha");
        let store : Store = new StoreStub(founder.getUserId());
        let manager : Subscriber = new Subscriber("elad");
        Appointment.appoint_manager(founder,store,manager,new Permission(0));
        expect(isOk(Appointment.appoint_manager(founder,store,manager,new Permission(0)))).to.equal(false);
    })

    it('try to reappoint founder as manager', function(){
        let founder : Subscriber = new Subscriber("micha");
        let store : Store = new StoreStub(founder.getUserId());
        Appointment.appoint_founder(founder,store);  
        let manager : Subscriber = new Subscriber("elad");
        expect(isOk(Appointment.appoint_manager(founder,store,founder,new Permission(0)))).to.equal(false);
    })




});