import { assert } from "chai"
import { PATH_TO_SYSTEM_MANAGERS, PAYMENT_SYSTEM_URL, setPathToSystemManagers, setPaymentSystemURL, setSupplySystemURL, SUPPLY_SYSTEM_URL } from "../../config"
import { SystemFacade } from "../../src/DomainLayer/SystemFacade"
import { Service } from "../../src/ServiceLayer/Service"

describe('config file tests',function () {

    it('invalid pyament system', async function(){
        let payment_system_backup = PAYMENT_SYSTEM_URL 
        this.timeout(100000)
        setPaymentSystemURL("youtube.com")
        let facade = new SystemFacade()
        try{
            await facade.init()
            console.log("passed init")
            assert.fail("should throw exception")
        }
        catch(e){
            setPaymentSystemURL(payment_system_backup)
            //catch is good
        }
    })

    it('invalid supply system', async function(){
        let supply_system_backup = SUPPLY_SYSTEM_URL 
        this.timeout(100000)
        setSupplySystemURL("youtube.com")
        let facade = new SystemFacade()
        try{
            await facade.init()
            console.log("passed init")
            assert.fail("should throw exception")
        }
        catch(e){
            setPaymentSystemURL(supply_system_backup)
            //catch is good
        }
    })


    it('invalid system managers path', async function(){
        let system_managers_backup = PATH_TO_SYSTEM_MANAGERS 
        this.timeout(100000)
        setPathToSystemManagers("youtube.com")
        let facade = new SystemFacade()
        try{
            await facade.init()
            console.log("passed init")
            assert.fail("should throw exception")
        }
        catch(e){
            setPathToSystemManagers(system_managers_backup)
            //catch is good
        }
    })


})