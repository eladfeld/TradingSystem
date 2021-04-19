import {expect} from 'chai';
import { ACTION, Permission } from '../../../src/DomainLayer/user/Permission';




describe('permission tests' , function() {
    it('checked assigned permission' , function(){
        let permission : Permission = new Permission(ACTION.APPOINT_MANAGER);
        expect(permission.checkIfPermited(ACTION.APPOINT_MANAGER)).to.equal(true);
    });

    it('multiple permissions(1)' , function(){
        let permission : Permission = new Permission(2 | 8 | 16);
        expect(permission.checkIfPermited(16)).to.equal(true);
    });

    it('multiple permissions(2)' , function(){
        let permission : Permission = new Permission(2 | 8 | 16);
        expect(permission.checkIfPermited(32)).to.equal(false);
    });

    it('checked unassigned permission' , function(){
        let permission : Permission = new Permission(ACTION.APPOINT_MANAGER);
        expect(permission.checkIfPermited(ACTION.APPOINT_OWNER)).to.equal(false);
    });


    


});