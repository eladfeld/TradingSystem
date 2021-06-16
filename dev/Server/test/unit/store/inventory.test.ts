import { expect, assert } from "chai"
import { set_DB } from "../../../src/DataAccessLayer/DBfacade";
import { Inventory } from "../../../src/DomainLayer/store/Inventory"
import { isOk } from "../../../src/Result"
import { APIsWillSucceed, failIfRejected } from "../../testUtil"
import {setReady, waitToRun} from '../../testUtil';
import { DBstub } from "../DBstub";

describe('reserve product' , () => {
    let stubDB = new DBstub()
    beforeEach( () => {
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        setReady(true);
    });

    it('test reserve product', async() => {
        set_DB(stubDB)
        let inventory = new Inventory(1,[])
        let productId = await failIfRejected(()=> inventory.addNewProduct('somthing', ['Computer'], 1, 30, 30,""))
        expect(isOk(inventory.reserveProduct(productId, 10))).to.equal(true)
        expect(inventory.isProductAvailable(productId, 19)).to.equal(true)
        expect(inventory.isProductAvailable(productId, 30)).to.equal(false)
    })

    it('test return reserve product', async() => {
        set_DB(stubDB)
        let inventory = new Inventory(1,[])
        let productId = await failIfRejected(()=>inventory.addNewProduct('somthing', ['Computer'], 1, 30,0,""));
        inventory.returnReservedProduct(productId, 10)
        expect(inventory.isProductAvailable(productId, 10)).to.equal(true)
        expect(inventory.isProductAvailable(productId, 30)).to.equal(false)
    })
})