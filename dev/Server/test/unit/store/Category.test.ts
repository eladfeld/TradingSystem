import { expect } from "chai";
import { Store } from "../../../src/DomainLayer/store/Store";
import { Subscriber } from "../../../src/DomainLayer/user/Subscriber";
import { isFailure, isOk } from "../../../src/Result";

describe('category tests' , () => {

    it('add the same category twice', () => {
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
        store.addCategoryToRoot('Sport')
        store.addCategoryToRoot('Sport')
        expect(isFailure(store.addCategoryToRoot('Sport'))).to.equal(true)
    })

    it('add children category', () => {
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
        store.addCategoryToRoot('Sport')
        expect(isOk(store.addCategory('Sport', 'Shoes'))).to.equal(true)

    })

    it('add children category twice', () => {
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
        store.addCategoryToRoot('Sport')
        expect(isOk(store.addCategory('Sport', 'Shoes'))).to.equal(true)
        expect(isFailure(store.addCategory('Sport', 'Shoes'))).to.equal(true)

    })

    it('add children category with missing root', () => {
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
        expect(isFailure(store.addCategory('Sport', 'Shoes'))).to.equal(true)

    })

    it('add children category to multiple roots', () => {
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
        store.addCategoryToRoot('Sport')
        store.addCategoryToRoot('Casual')

        expect(isOk(store.addCategory('Sport', 'Shoes'))).to.equal(true)
        expect(isFailure(store.addCategory('Casual', 'Shoes'))).to.equal(true)

    })

});