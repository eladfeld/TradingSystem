import { expect, assert } from "chai"
import { Inventory } from "../../../src/DomainLayer/store/Inventory"
import { ProductDB } from "../../../src/DomainLayer/store/ProductDB"
import { isOk } from "../../../src/Result"

describe('reserve product' , () => {

    it('test reserve product', () => {

        let inventory = new Inventory()
        let productId = inventory.addNewProduct('somthing', ['Computer'], 1, 30, 30)
        if(isOk(productId)){
            expect(isOk(inventory.reserveProduct(productId.value, 10))).to.equal(true)
            expect(inventory.isProductAvailable(productId.value, 19)).to.equal(true)
            expect(inventory.isProductAvailable(productId.value, 30)).to.equal(false)
        }
        else {
            assert.fail('failed add new product')
        }
    })

    it('test return reserve product', () => {
        let inventory = new Inventory()
        let productId = inventory.addNewProduct('somthing', ['Computer'], 1, 30)
        if(isOk(productId)){
            inventory.returnReservedProduct(productId.value, 10)
            expect(inventory.isProductAvailable(productId.value, 10)).to.equal(true)
            expect(inventory.isProductAvailable(productId.value, 30)).to.equal(false)
        }
        else {
            assert.fail('failed add new product')
        }
    })
})