import { expect } from "chai"
import { StoreProduct } from "../../../src/DomainLayer/store/StoreProduct"
import { isFailure, isOk } from "../../../src/Result"

describe('rate product' , () => {

    it('test rate product', () => {

        let storeProduct = new StoreProduct(1, 'somthing', 30, 3, 30, ['Electric'],"")
        storeProduct.addProductRating(5)
        storeProduct.addProductRating(3)
        expect(storeProduct.getNumOfRaters()).to.equal(2)
        expect(storeProduct.getProductRating()).to.equal(4)
    })

    it('test rate with invalid number', () => {
        let storeProduct = new StoreProduct(1, 'somthing', 30, 3, 30, ['Electric'],"")
        expect(isFailure(storeProduct.addProductRating(6))).to.equal(true)
    })
})

describe('set quantity' , () => {
    it('test set quantity', () => {
        let storeProduct = new StoreProduct(1, 'somthing', 30, 3, 30, ['Electric'],"")
        storeProduct.setQuantity(5)
        expect(storeProduct.getQuantity()).to.equal(5)
    })

    it('test set quantity invalid number', () => {
        let storeProduct = new StoreProduct(1, 'somthing', 30, 3, 30, ['Electric'],"")
        expect(isFailure(storeProduct.setQuantity(-1))).to.equal(true)
    })

    it('test add quantity', () => {
        let storeProduct = new StoreProduct(1, 'somthing', 30, 3, 30, ['Electric'],"")
        expect(isOk(storeProduct.addQuantity(100))).to.equal(true)
        expect(storeProduct.getQuantity()).to.equal(130)
    })
})