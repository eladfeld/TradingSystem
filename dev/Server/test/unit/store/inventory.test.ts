import { expect, assert } from "chai"
import { Inventory } from "../../../src/DomainLayer/store/Inventory"
import { ProductDB } from "../../../src/DomainLayer/store/ProductDB"
import { isOk } from "../../../src/Result"
import { failIfRejected } from "../../testUtil"

describe('reserve product' , () => {

    it('test reserve product', async() => {
        let inventory = new Inventory()
        let productId = await failIfRejected(()=> inventory.addNewProduct('somthing', ['Computer'], 1, 30, 30))
        expect(isOk(inventory.reserveProduct(productId, 10))).to.equal(true)
        expect(inventory.isProductAvailable(productId, 19)).to.equal(true)
        expect(inventory.isProductAvailable(productId, 30)).to.equal(false)
    })

    it('test return reserve product', async() => {
        let inventory = new Inventory()
        let productId = await failIfRejected(()=>inventory.addNewProduct('somthing', ['Computer'], 1, 30));
        inventory.returnReservedProduct(productId, 10)
        expect(inventory.isProductAvailable(productId, 10)).to.equal(true)
        expect(inventory.isProductAvailable(productId, 30)).to.equal(false)
    })
})