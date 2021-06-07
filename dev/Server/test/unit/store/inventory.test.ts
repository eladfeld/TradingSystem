import { expect, assert } from "chai"
import { Inventory } from "../../../src/DomainLayer/store/Inventory"
import { isOk } from "../../../src/Result"
import { APIsWillSucceed, failIfRejected } from "../../testUtil"
import {setReady, waitToRun} from '../../testUtil';

describe('reserve product' , () => {
    beforeEach( () => {
        //console.log('start')
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        //console.log('finish');        
        setReady(true);
    });

    it('test reserve product', async() => {
        let inventory = new Inventory()
        let productId = await failIfRejected(()=> inventory.addNewProduct('somthing', ['Computer'], 1, 30, 30,""))
        expect(isOk(inventory.reserveProduct(productId, 10))).to.equal(true)
        expect(inventory.isProductAvailable(productId, 19)).to.equal(true)
        expect(inventory.isProductAvailable(productId, 30)).to.equal(false)
    })

    it('test return reserve product', async() => {
        let inventory = new Inventory()
        let productId = await failIfRejected(()=>inventory.addNewProduct('somthing', ['Computer'], 1, 30,0,""));
        inventory.returnReservedProduct(productId, 10)
        expect(inventory.isProductAvailable(productId, 10)).to.equal(true)
        expect(inventory.isProductAvailable(productId, 30)).to.equal(false)
    })
})