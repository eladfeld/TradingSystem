import { expect } from "chai";
import { Store } from "../../../src/DomainLayer/store/Store";
import { Subscriber } from "../../../src/DomainLayer/user/Subscriber";
import { isFailure, isOk } from "../../../src/Result";
import { failIfRejected, failIfResolved, failTestFromError } from "../../testUtil";

describe('category tests' , () => {

    it('add the same category twice', async() => {
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
        try{
            await store.addCategoryToRoot('Sport')
        }catch(e){
            failTestFromError(e);
        }
        await failIfResolved(() => store.addCategoryToRoot('Sport'))
    })

    it('add children category', async() => {
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
        store.addCategoryToRoot('Sport')
        await failIfRejected(() => store.addCategory('Sport', 'Shoes') )
    })

    it('add children category twice', async() => {
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
        store.addCategoryToRoot('Sport')
        await failIfRejected(() => store.addCategory('Sport', 'Shoes'));
        await failIfResolved(() => store.addCategory('Sport', 'Shoes'))
    })

    it('add children category with missing root', async() => {
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
        await failIfResolved(() => store.addCategory('Sport', 'Shoes'))
    })

    it('add children category to multiple roots', async() => {
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
        store.addCategoryToRoot('Sport')
        store.addCategoryToRoot('Casual')
        await failIfRejected(()=>store.addCategory('Sport', 'Shoes'));
        await failIfResolved(()=>store.addCategory('Casual', 'Shoes'))
    })

});