import { expect } from "chai";
import { set_DB } from "../../../src/DataAccessLayer/DBfacade";
import { Store } from "../../../src/DomainLayer/store/Store";
import { Subscriber } from "../../../src/DomainLayer/user/Subscriber";
import { isFailure, isOk } from "../../../src/Result";
import { APIsWillSucceed, failIfRejected, failIfResolved, failTestFromError } from "../../testUtil";
import {setReady, waitToRun} from '../../testUtil';
import { DBstub } from "../DBstub";

describe('category tests' , () => {
    let stubDB = new DBstub()
    beforeEach( () => {
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        setReady(true);
    });

    it('add the same category twice', async() => {
        set_DB(stubDB)
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
        try{
            await store.addCategoryToRoot('Sport')
        }catch(e){
            failTestFromError(e);
        }
        await failIfResolved(() => store.addCategoryToRoot('Sport'))
    })

    it('add children category', async() => {
        set_DB(stubDB)
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
        await store.addCategoryToRoot('Sport')
        await failIfRejected(() => store.addCategory('Sport', 'Shoes') )
    })

    it('add children category twice', async() => {
        set_DB(stubDB)
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
        await store.addCategoryToRoot('Sport')
        await failIfRejected(() => store.addCategory('Sport', 'Shoes'));
        await failIfResolved(() => store.addCategory('Sport', 'Shoes'))
    })

    it('add children category with missing root', async() => {
        set_DB(stubDB)
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
        await failIfResolved(() => store.addCategory('Sport', 'Shoes'))
    })

    it('add children category to multiple roots', async() => {
        set_DB(stubDB)
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
        await store.addCategoryToRoot('Sport')
        await store.addCategoryToRoot('Casual')
        await failIfRejected(()=>store.addCategory('Sport', 'Shoes'));
        await failIfResolved(()=>store.addCategory('Casual', 'Shoes'))
    })

});