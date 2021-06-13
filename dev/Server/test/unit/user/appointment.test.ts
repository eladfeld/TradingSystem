import {assert, expect} from 'chai';
import { Store } from '../../../src/DomainLayer/store/Store';
import { Appointment } from '../../../src/DomainLayer/user/Appointment';
import { MakeAppointment } from '../../../src/DomainLayer/user/MakeAppointment';
import { ACTION, Permission } from '../../../src/DomainLayer/user/Permission';
import { Subscriber } from '../../../src/DomainLayer/user/Subscriber';
import { isOk } from '../../../src/Result';
import { StoreStub } from './StoreStub';
import {APIsWillSucceed, failIfRejected, failIfResolved, failTest} from '../../testUtil';
import {setReady, waitToRun} from '../../testUtil';

const HASHED_PASSWORD = "7110eda4d09e062aa5e4a390b0a572ac0d2c0220";

describe('AppointmentManager tests' , function() {
    beforeEach( () => {
        this.timeout(5000);
        //console.log('start')
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        //console.log('finish');        
        setReady(true);
    });

    it('appoint founder' , async function() {
        let founder : Subscriber = new Subscriber("micha",HASHED_PASSWORD,13);
        let store : Store = new StoreStub(founder.getUserId(),"Aluf Hasport" , 123456 , "Tel Aviv");
        await failIfRejected(()=>MakeAppointment.appoint_founder(founder,store));
    })

    it('try to appoint someone who didnt open the store as founder', async function(){
        let founder : Subscriber = new Subscriber("micha",HASHED_PASSWORD,13);
        let not_founder : Subscriber = new Subscriber("elad",HASHED_PASSWORD,13);
        let store : Store = new StoreStub(founder.getUserId(),"Aluf Hasport" , 123456 , "Tel Aviv");
        await failIfResolved(()=>MakeAppointment.appoint_founder(not_founder,store))
    })

    it('appoint manager', async function(){
        let founder : Subscriber = new Subscriber("micha",HASHED_PASSWORD,13);
        let store : Store = new StoreStub(founder.getUserId(),"Aluf Hasport" , 123456 , "Tel Aviv");
        await MakeAppointment.appoint_founder(founder,store);   
        let manager : Subscriber = new Subscriber("micha",HASHED_PASSWORD,13);
        await failIfRejected(() => MakeAppointment.appoint_manager(founder,store,manager));
    })

    it('appoint manager without permissions',async function(){
        let founder : Subscriber = new Subscriber("micha",HASHED_PASSWORD,13);
        let store : Store = new StoreStub(founder.getUserId(),"Aluf Hasport" , 123456 , "Tel Aviv");
        await MakeAppointment.appoint_founder(founder,store);  
        let manager : Subscriber = new Subscriber("elad",HASHED_PASSWORD,13);
        await MakeAppointment.appoint_manager(founder,store,manager); // no permissions
        let subscriber : Subscriber = new Subscriber("zuri", HASHED_PASSWORD,13);
        await failIfResolved(() => MakeAppointment.appoint_manager(manager,store,subscriber));
    })

    it('try to reappoint user',async function(){
        let founder : Subscriber = new Subscriber("micha",HASHED_PASSWORD,13);
        let store : Store = new StoreStub(founder.getUserId(),"Aluf Hasport" , 123456 , "Tel Aviv");
        await MakeAppointment.appoint_founder(founder,store);
        let manager : Subscriber = new Subscriber("elad",HASHED_PASSWORD,13);
        await MakeAppointment.appoint_manager(founder,store,manager);
        await failIfResolved(() => MakeAppointment.appoint_manager(founder,store,manager))
    })

    it('try to reappoint founder as manager',async function(){
        let founder : Subscriber = new Subscriber("micha",HASHED_PASSWORD,13);
        let store : Store = new StoreStub(founder.getUserId(),"Aluf Hasport" , 123456 , "Tel Aviv");
        await MakeAppointment.appoint_founder(founder,store);  
        let manager : Subscriber = new Subscriber("elad",HASHED_PASSWORD,13);
        await failIfResolved(() => MakeAppointment.appoint_manager(founder,store,founder));
    })

    it('appoint owner',async function(){
        let founder : Subscriber = new Subscriber("micha",HASHED_PASSWORD,13);
        let store : Store = new StoreStub(founder.getUserId(),"Aluf Hasport" , 123456 , "Tel Aviv");
        await MakeAppointment.appoint_founder(founder,store);   
        let owner : Subscriber = new Subscriber("micha",HASHED_PASSWORD,13);
        await failIfRejected(() => MakeAppointment.appoint_manager(founder,store,owner))
    })

    it('appoint owner without permissions',async function(){
        let founder : Subscriber = new Subscriber("micha",HASHED_PASSWORD,22);
        let store : Store = new StoreStub(founder.getUserId(),"Aluf Hasport" , 123456 , "Tel Aviv");
        await MakeAppointment.appoint_founder(founder,store);  
        let owner : Subscriber = new Subscriber("elad",HASHED_PASSWORD,13);
        await MakeAppointment.appoint_manager(founder,store,owner); // no permissions
        let subscriber : Subscriber = new Subscriber("zuri",HASHED_PASSWORD,13);
        await failIfResolved(() => MakeAppointment.appoint_owner(owner,store,subscriber))
    })

    
    it('appoint manager to owner',async function(){
        let founder : Subscriber = new Subscriber("micha",HASHED_PASSWORD,13);
        let store : Store = new StoreStub(founder.getUserId(),"Aluf Hasport" , 123456 , "Tel Aviv");
        await MakeAppointment.appoint_founder(founder,store);  
        let manager : Subscriber = new Subscriber("elad",HASHED_PASSWORD, 13);
        await MakeAppointment.appoint_manager(founder,store,manager);
        await failIfRejected(() => MakeAppointment.appoint_owner(founder,store,manager))
    })

    it('remove appointment good',async function() {//here
        let founder : Subscriber = new Subscriber("micha",HASHED_PASSWORD, 13);
        let store : Store = new StoreStub(founder.getUserId(),"Aluf Hasport" , 123456 , "Tel Aviv");
        await MakeAppointment.appoint_founder(founder,store);  
        let manager : Subscriber = new Subscriber("elad",HASHED_PASSWORD, 13);
        await MakeAppointment.appoint_manager(founder,store,manager);
        let appointment = store.findAppointedBy(founder.getUserId(), manager.getUserId())
        await MakeAppointment.removeAppointment(appointment);
        expect(manager.getAppointments().length).to.equal(0);
    })

    it('remove appointment bad',async function(){
        let founder : Subscriber = new Subscriber("micha",HASHED_PASSWORD, 13);
        let store : Store = new StoreStub(founder.getUserId(),"Aluf Hasport" , 123456 , "Tel Aviv");
        await MakeAppointment.appoint_founder(founder,store);  
        let manager : Subscriber = new Subscriber("elad",HASHED_PASSWORD, 13);
        await MakeAppointment.appoint_manager(founder,store,manager);
        failIfResolved(() => MakeAppointment.removeAppointment(store.findAppointedBy(manager.getUserId(), founder.getUserId())));
    })

    

});