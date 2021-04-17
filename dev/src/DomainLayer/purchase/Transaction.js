"use strict";
exports.__esModule = true;
exports.TransactionStatus = void 0;
exports.TransactionStatus = {
    TIMED_OUT: -3,
    FAIL_RESERVE: -2,
    CANCELED: -1,
    IN_PROGRESS: 0,
    ITEMS_RESERVED: 2,
    PAID: 3,
    SUPPLIED: 4
};
Object.freeze(exports.TransactionStatus);
var Transaction = /** @class */ (function () {
    function Transaction(userId, storeId, items, total) {
        var _this = this;
        this.setShipmentId = function (shipmentId) {
            _this.shipmentId = shipmentId;
        };
        this.setStatus = function (status) {
            _this.status = status;
        };
        this.getTotal = function () { return _this.total; };
        this.getId = function () { return _this.transcationId; };
        this.getShipmentId = function () { return _this.shipmentId; };
        this.getUserId = function () { return _this.userId; };
        this.getStoreId = function () { return _this.storeId; };
        this.getItems = function () { return _this.items; };
        this.getStatus = function () { return _this.status; };
        this.transcationId = Transaction.nextId++;
        this.userId = userId;
        this.storeId = storeId;
        this.items = items; //this.cartToTree(user.shoppingCart);
        this.total = total; //this.basketTotal(this.items);
        this.status = exports.TransactionStatus.IN_PROGRESS;
        this.time = Date.now();
        this.cardNumber = null;
        this.shipmentId = -1;
    }
    Transaction.nextId = 1;
    return Transaction;
}());
exports["default"] = Transaction;
