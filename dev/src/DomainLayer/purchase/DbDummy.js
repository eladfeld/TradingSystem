"use strict";
exports.__esModule = true;
var DbDummy = /** @class */ (function () {
    function DbDummy() {
        var _this = this;
        this.storeCompletedTransaction = function (transaction) {
            _this.completedTransactions.push(transaction);
        };
        this.getCompletedTransactions = function () {
            return _this.completedTransactions;
        };
        this.storeTransactionInProgress = function (transaction) {
            _this.transactionsInProgress.push(transaction);
        };
        this.removeTransactionInProgress = function (userId, storeId) {
            _this.transactionsInProgress = _this.transactionsInProgress.filter(function (t) { return ((t.getUserId() !== userId) || (t.getStoreId() !== storeId)); });
        };
        this.getTransactionInProgress = function (userId, storeId) {
            return _this.transactionsInProgress.filter(function (t) { return ((t.getUserId() === userId) && (t.getStoreId() === storeId)); })[0];
        };
        this.getTransactionsInProgress = function (userId, storeId) {
            return _this.transactionsInProgress.filter(function (t) { return ((t.getUserId() === userId) && (t.getStoreId() === storeId)); });
        };
        this.completedTransactions = [];
        this.transactionsInProgress = [];
        this.usersAtCheckout = new Map();
    }
    return DbDummy;
}());
exports["default"] = DbDummy;
