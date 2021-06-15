import {assert, expect} from 'chai';
import { isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { APIsWillSucceed, failTest, setReady, waitToRun } from '../testUtil';
import SupplySystem from '../../src/DomainLayer/apis/SupplySystem';
import PaymentSystem from '../../src/DomainLayer/apis/PaymentSystem';
import { PATH_TO_SYSTEM_MANAGERS, setPathToSystemManagers } from '../../config';
import { truncate_tables } from '../../src/DataAccessLayer/connectDb';
// import fs from '../../../Client/node_modules/fs-extra/lib/fs/index.js'

// 
describe('1.1 Ensure Proper Initialization' , function() {
    
    beforeEach( () => {
        
        return waitToRun(()=>{
            APIsWillSucceed();
            Service.uninitialize();
        });
    });

    afterEach(function () {
        setReady(true);
    });
   
    it('main success scenario - successfully init' ,async function() {
        this.timeout(100000)
        await truncate_tables()
        await Service.get_instance();
        //didnt throw error is a pass
    })

    it('fail to init supply system - system should not init' ,function() {
        this.timeout(100000)
        SupplySystem.willFail();
        try{
            Service.get_instance();
            failTest("system initialized without supply system")
        }catch(e){
            //should throw error. this is good
        }
    })

    it('fail to init payment system - system should not init' ,function() {
        this.timeout(100000)
        PaymentSystem.willFail();
        try{
            Service.get_instance();
            failTest("system initialized without supply system")
        }catch(e){
            //should throw error. this is good
        }
    })

    it('no system managers - system should not init' ,function() {
        this.timeout(100000)
        const originalPath:string = (' ' + PATH_TO_SYSTEM_MANAGERS).slice(1);//deep copy of string
        try{
            setPathToSystemManagers('../resources/empty_list.json');
            Service.get_instance();
            setPathToSystemManagers(originalPath);
            failTest("system initialized without supply system")
        }catch(e){
            //should throw error. this is good
            setPathToSystemManagers(originalPath);
        }
    })

});