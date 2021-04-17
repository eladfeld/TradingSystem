"use strict";
exports.__esModule = true;
exports.StoreHistory = void 0;
var StoreHistory = /** @class */ (function () {
    function StoreHistory(storeId, storeName, createdAt) {
        this.createdAt = createdAt;
        this.storeId = storeId;
        this.storeName = storeName;
        this.sales = [];
    }
    StoreHistory.prototype.saveTransaction = function (transaction) {
        this.sales.push(transaction);
    };
    StoreHistory.prototype.getSale = function () {
        return this.sales;
    };
    return StoreHistory;
}());
exports.StoreHistory = StoreHistory;
