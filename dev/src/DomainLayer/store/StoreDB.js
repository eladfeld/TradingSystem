"use strict";
exports.__esModule = true;
exports.StoreDB = void 0;
var StoreDB = /** @class */ (function () {
    function StoreDB() {
    }
    StoreDB.addStore = function (store) {
        this.stores.push(store);
    };
    StoreDB.getStoreByID = function (storeId) {
        return this.stores.find(function (store) { return store.getStoreId() == storeId; });
    };
    StoreDB.deleteStore = function (storeId) {
        this.stores = this.stores.filter(function (store) { return store.getStoreId() !== storeId; });
    };
    StoreDB.stores = [];
    return StoreDB;
}());
exports.StoreDB = StoreDB;
