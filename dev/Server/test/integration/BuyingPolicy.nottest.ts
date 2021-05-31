// import { assert, expect } from 'chai';
// import { Authentication } from '../../src/DomainLayer/user/Authentication';
// import { isFailure, isOk, Result } from '../../src/Result';
// import { SystemFacade } from '../../src/DomainLayer/SystemFacade'
// import { Service } from '../../src/ServiceLayer/Service';
// import { register_login, open_store } from '../acceptence/common';
// import { APIsWillSucceed } from '../testUtil';

// describe('4.5:Appoint manager tests', function () {

//     var service: Service = Service.get_instance();
//     beforeEach(function () {
//         APIsWillSucceed();
//     });

//     afterEach(function () {
//         service.clear();
//     });
//     it('avi opens store and appoints moshe to manager', async function () {
//         let avi_sessionId = await service.enter();
//         let moshe_sessionId = await service.enter();
//         let avi = await register_login(service,avi_sessionId, "avi", "123456789");
//         let moshe = await register_login(service,moshe_sessionId, "moshe", "123456789");
//         let store = await open_store(service, avi_sessionId,avi, "Mega", 123456, "Tel Aviv");
//         service.appointStoreManager(avi_sessionId, store.getStoreId(), moshe.getUsername())
//         .then(_ => assert.ok(""))
//         .catch(_ => assert.fail())
//     })

// });