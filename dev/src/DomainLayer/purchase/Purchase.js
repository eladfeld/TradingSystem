"use strict";
exports.__esModule = true;
exports.stringUtil = void 0;
var PaymentSystemAdapter_1 = require("./PaymentSystemAdapter");
var SupplySystemAdapter_1 = require("./SupplySystemAdapter");
var Transaction_1 = require("./Transaction");
var DbDummy_1 = require("./DbDummy");
var ShippingInfo_1 = require("./ShippingInfo");
var Result_1 = require("../../Result");
exports.stringUtil = {
    FAIL_RESERVE_MSG: "could not reserve shipment",
    FAIL_PAYMENT_TIMEOUT: "your current payment session has expired, please proceed back to checkout",
    FAIL_NO_TRANSACTION_IN_PROG: "user has no transaction in progress",
    FAIL_PAYMENT_REJECTED_PREFIX: "Your payment could be processed.",
    FAIL_FINALIZE_SHIPMENT: "We could not ship your items, you have been refunded, please try again later"
};
Object.freeze(exports.stringUtil);
var PAYMENT_TIMEOUT_MILLISEC = 300000;
var Purchase = /** @class */ (function () {
    function Purchase() {
        var _this = this;
        this.checkout = function (store, total, userId, products, shipAdrs) {
            var storeId = store.getStoreId();
            var transaction = new Transaction_1["default"](userId, storeId, products, total);
            var shippingInfo = new ShippingInfo_1["default"](userId, storeId, shipAdrs, store.getStoreAddress());
            var _a = _this.getTimerAndCart(userId, storeId), oldTimerId = _a[0], oldCart = _a[1];
            if (oldTimerId !== undefined) {
                //a checkout is already in progress, cancel the old timer/order
                clearTimeout(oldTimerId);
                _this.cancelTransaction(userId, store, oldCart);
            }
            var shipmentId = _this.supplySystem.reserve(shippingInfo);
            if (shipmentId < 0) {
                //could not reserve shipping
                transaction.setStatus(Transaction_1.TransactionStatus.FAIL_RESERVE);
                _this.dbDummy.storeTransactionInProgress(transaction);
                return Result_1.makeFailure(exports.stringUtil.FAIL_RESERVE_MSG);
            }
            //allow payment within 5 minutes
            transaction.setStatus(Transaction_1.TransactionStatus.ITEMS_RESERVED);
            transaction.setShipmentId(shipmentId);
            _this.dbDummy.storeTransactionInProgress(transaction);
            var timerId = setTimeout(function () {
                _this.cancelTransaction(userId, store, oldCart);
                _this.supplySystem.cancelReservation(shipmentId);
            }, PAYMENT_TIMEOUT_MILLISEC);
            _this.addTimerAndCart(userId, storeId, timerId, products);
            return Result_1.makeOk(true);
        };
        this.CompleteOrder = function (userId, storeId, paymentInfo, storeAccount) {
            var transaction = _this.dbDummy.getTransactionInProgress(userId, storeId);
            if (!transaction) {
                return Result_1.makeFailure(exports.stringUtil.FAIL_NO_TRANSACTION_IN_PROG); //nothing reserved
            }
            var _a = _this.getTimerAndCart(userId, storeId), timerId = _a[0], oldCart = _a[1];
            if (timerId === undefined) {
                return Result_1.makeFailure(exports.stringUtil.FAIL_PAYMENT_TIMEOUT); //times up!!
            }
            var paymentRes = _this.paymentSystem.transfer(paymentInfo, storeAccount, transaction.getTotal());
            if (Result_1.isFailure(paymentRes)) {
                return Result_1.makeFailure(exports.stringUtil.FAIL_PAYMENT_REJECTED_PREFIX + '\n' + paymentRes.message);
            }
            clearTimeout(timerId);
            _this.removeTimerAndCart(userId, storeId);
            var paymentId = paymentRes.value;
            transaction.setStatus(Transaction_1.TransactionStatus.PAID);
            var isShipped = _this.supplySystem.supply(transaction.getShipmentId());
            if (!isShipped) {
                _this.paymentSystem.refund(paymentId); //TODO: verify refunds
                return Result_1.makeFailure(exports.stringUtil.FAIL_FINALIZE_SHIPMENT);
            }
            transaction.setStatus(Transaction_1.TransactionStatus.SUPPLIED);
            _this.dbDummy.storeCompletedTransaction(transaction);
            _this.dbDummy.removeTransactionInProgress(userId, storeId);
            return Result_1.makeOk(true);
        };
        this.cancelTransaction = function (userId, store, oldCart) {
            store.cancelReservedShoppingBasket(oldCart);
            _this.removeTimerAndCart(userId, store.getStoreId());
            _this.dbDummy.removeTransactionInProgress(userId, store.getStoreId());
        };
        this.addTimerAndCart = function (userId, storeId, timerId, products) {
            if (_this.cartCheckoutTimers.get(userId) === undefined) {
                _this.cartCheckoutTimers.set(userId, new Map());
            }
            _this.cartCheckoutTimers.get(userId).set(storeId, [timerId, products]);
        };
        this.removeTimerAndCart = function (userId, storeId) {
            try {
                var _a = _this.getTimerAndCart(userId, storeId), timerId = _a[0], basket = _a[1];
                if (timerId === undefined)
                    return;
                clearTimeout(timerId);
                _this.cartCheckoutTimers.get(userId)["delete"](storeId);
            }
            catch (e) { }
            return;
        };
        this.getTimerAndCart = function (userId, storeId) {
            try {
                var pair = _this.cartCheckoutTimers.get(userId).get(storeId);
                if (pair !== undefined) {
                    return pair;
                }
            }
            catch (e) {
                //nothing really, this is main case
            }
            return [undefined, undefined];
        };
        this.hasCheckoutInProgress = function (userId, storeId) {
            var _a = _this.getTimerAndCart(userId, storeId), timerId = _a[0], cart = _a[1];
            return ((timerId !== undefined) && (cart !== undefined));
        };
        this.numTransactionsInProgress = function (userId, storeId) {
            var transactions = _this.dbDummy.getTransactionsInProgress(userId, storeId);
            return transactions.length;
        };
        this.getTransactionInProgress = function (userId, storeId) {
            return _this.dbDummy.getTransactionInProgress(userId, storeId);
        };
        this.getCompletedTransactions = function (userId, storeId) {
            return _this.dbDummy.getCompletedTransactions().filter(function (t) { return ((t.getUserId() == userId) && (t.getStoreId() == storeId)); });
        };
        this.getCompletedTransactionsForStore = function (storeId) {
            return _this.dbDummy.getCompletedTransactions().filter(function (t) { return t.getStoreId() == storeId; });
        };
        this.paymentSystem = new PaymentSystemAdapter_1["default"]();
        this.supplySystem = new SupplySystemAdapter_1["default"]();
        this.cartCheckoutTimers = new Map();
        this.dbDummy = new DbDummy_1["default"]();
    }
    return Purchase;
}());
var INSTANCE = new Purchase();
exports["default"] = INSTANCE;
