import {expect} from 'chai';
import { Store } from '../../../src/DomainLayer/store/Store';
import { Appointment } from '../../../src/DomainLayer/user/Appointment';
import { MakeAppointment } from '../../../src/DomainLayer/user/MakeAppointment';
import { ACTION, Permission } from '../../../src/DomainLayer/user/Permission';
import { Subscriber } from '../../../src/DomainLayer/user/Subscriber';
import { isOk } from '../../../src/Result';
import { StoreStub } from './StoreStub';

describe('AppointmentManager tests' , function() {

    it('appoint founder' , function() {
        let founder : Subscriber = new Subscriber("micha");
        let store : Store = new StoreStub(founder.getUserId(),"Aluf Hasport" , 123456 , "Tel Aviv");
        expect(isOk(MakeAppointment.appoint_founder(founder,store))).to.equal(true);
    })

    it('try to appoint someone who didnt open the store as founder', function(){
        let founder : Subscriber = new Subscriber("micha");
        let not_founder : Subscriber = new Subscriber("elad");
        let store : Store = new StoreStub(founder.getUserId(),"Aluf Hasport" , 123456 , "Tel Aviv");
        let appointment = MakeAppointment.appoint_founder(not_founder,store);
        expect(isOk(appointment)).to.equal(false);
    })

    it('appoint manager', function(){
        let founder : Subscriber = new Subscriber("micha");
        let store : Store = new StoreStub(founder.getUserId(),"Aluf Hasport" , 123456 , "Tel Aviv");
        MakeAppointment.appoint_founder(founder,store);   
        let manager : Subscriber = new Subscriber("micha");
        expect(isOk(MakeAppointment.appoint_manager(founder,store,manager))).to.equal(true);
    })

    it('appoint manager without permissions', function(){
        let founder : Subscriber = new Subscriber("micha");
        let store : Store = new StoreStub(founder.getUserId(),"Aluf Hasport" , 123456 , "Tel Aviv");
        MakeAppointment.appoint_founder(founder,store);  
        let manager : Subscriber = new Subscriber("elad");
        MakeAppointment.appoint_manager(founder,store,manager); // no permissions
        let subscriber : Subscriber = new Subscriber("zuri");
        expect(isOk(MakeAppointment.appoint_manager(manager,store,subscriber))).to.equal(false);
    })

    it('try to reappoint user', function(){
        let founder : Subscriber = new Subscriber("micha");
        let store : Store = new StoreStub(founder.getUserId(),"Aluf Hasport" , 123456 , "Tel Aviv");
        let manager : Subscriber = new Subscriber("elad");
        MakeAppointment.appoint_manager(founder,store,manager);
        expect(isOk(MakeAppointment.appoint_manager(founder,store,manager))).to.equal(false);
    })

    it('try to reappoint founder as manager', function(){
        let founder : Subscriber = new Subscriber("micha");
        let store : Store = new StoreStub(founder.getUserId(),"Aluf Hasport" , 123456 , "Tel Aviv");
        MakeAppointment.appoint_founder(founder,store);  
        let manager : Subscriber = new Subscriber("elad");
        expect(isOk(MakeAppointment.appoint_manager(founder,store,founder))).to.equal(false);
    })

    it('appoint owner', function(){
        let founder : Subscriber = new Subscriber("micha");
        let store : Store = new StoreStub(founder.getUserId(),"Aluf Hasport" , 123456 , "Tel Aviv");
        MakeAppointment.appoint_founder(founder,store);   
        let owner : Subscriber = new Subscriber("micha");
        expect(isOk(MakeAppointment.appoint_manager(founder,store,owner))).to.equal(true);
    })

    it('appoint owner without permissions', function(){
        let founder : Subscriber = new Subscriber("micha");
        let store : Store = new StoreStub(founder.getUserId(),"Aluf Hasport" , 123456 , "Tel Aviv");
        MakeAppointment.appoint_founder(founder,store);  
        let owner : Subscriber = new Subscriber("elad");
        MakeAppointment.appoint_manager(founder,store,owner); // no permissions
        let subscriber : Subscriber = new Subscriber("zuri");
        expect(isOk(MakeAppointment.appoint_owner(owner,store,subscriber))).to.equal(false);
    })

    
    it('appoint manager to owner', function(){
        let founder : Subscriber = new Subscriber("micha");
        let store : Store = new StoreStub(founder.getUserId(),"Aluf Hasport" , 123456 , "Tel Aviv");
        MakeAppointment.appoint_founder(founder,store);  
        let manager : Subscriber = new Subscriber("elad");
        MakeAppointment.appoint_manager(founder,store,manager); 
        expect(isOk(MakeAppointment.appoint_owner(founder,store,manager))).to.equal(true);
    })

    it('remove appontment good', function() {
        let founder : Subscriber = new Subscriber("micha");
        let store : Store = new StoreStub(founder.getUserId(),"Aluf Hasport" , 123456 , "Tel Aviv");
        MakeAppointment.appoint_founder(founder,store);  
        let manager : Subscriber = new Subscriber("elad");
        MakeAppointment.appoint_manager(founder,store,manager);
        MakeAppointment.removeAppointment(store.findAppointedBy(founder.getUserId(), manager.getUserId()));
        expect(manager.getAppointments().length).to.equal(0);
    })

    it('remove appontment bad', function(){
        let founder : Subscriber = new Subscriber("micha");
        let store : Store = new StoreStub(founder.getUserId(),"Aluf Hasport" , 123456 , "Tel Aviv");
        MakeAppointment.appoint_founder(founder,store);  
        let manager : Subscriber = new Subscriber("elad");
        MakeAppointment.appoint_manager(founder,store,manager);
        expect(isOk(MakeAppointment.removeAppointment(store.findAppointedBy(manager.getUserId(), founder.getUserId())))).to.equal(false);
    })



});