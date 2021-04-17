import { expect } from "chai"
import { Category } from "../../src/DomainLayer/store/Common"
import { Inventory } from "../../src/DomainLayer/store/Inventory"
import { ProductDB } from "../../src/DomainLayer/store/ProductDB"
import { isOk } from "../../src/Result"

describe('reserve product' , () => {

    it('test reserve product', () => {

        let inventory = new Inventory()
        inventory.addNewProduct('somthing', [Category.COMPUTER], 1, 30, 30)
        let productId = ProductDB.getProductByName('somthing').getProductId()
        expect(isOk(inventory.reserveProduct(productId, 10))).to.equal(true)
        expect(inventory.isProductAvailable(productId, 19)).to.equal(true)
        expect(inventory.isProductAvailable(productId, 30)).to.equal(false)
    })

    it('test return reserve product', () => {
        let inventory = new Inventory()
        inventory.addNewProduct('somthing', [Category.COMPUTER], 1, 30)
        let productId = ProductDB.getProductByName('somthing').getProductId()
        inventory.returnReservedProduct(productId, 10)
        expect(inventory.isProductAvailable(productId, 10)).to.equal(true)
        expect(inventory.isProductAvailable(productId, 30)).to.equal(false)
    })
})