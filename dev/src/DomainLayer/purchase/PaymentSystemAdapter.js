"use strict";
exports.__esModule = true;
var Result_1 = require("../../Result");
var PaymentSystem_1 = require("../apis/PaymentSystem");
var PaymentSystemAdapter = /** @class */ (function () {
    function PaymentSystemAdapter() {
        this.init = function () {
            var res = PaymentSystem_1["default"].init();
            if (res < 0) //failed to init
                return Result_1.makeFailure(PaymentSystemAdapter.initResToMessage(res));
            return Result_1.makeOk(res);
        };
        //returns a transaction number
        this.transfer = function (from, to, amount) {
            var res = PaymentSystem_1["default"].transfer(from.getCardNumber(), from.getExpiration(), from.getCvv(), to, amount);
            if (res < 0)
                return Result_1.makeFailure(PaymentSystemAdapter.transferResToMessage(res));
            return Result_1.makeOk(res);
        };
        this.refund = function (transactionNumber) {
            return PaymentSystem_1["default"].refund(transactionNumber);
        };
    }
    PaymentSystemAdapter.transferResToMessage = function (res) {
        switch (res) {
            default:
                return "Failed to transfer funds.";
        }
    };
    PaymentSystemAdapter.initResToMessage = function (res) {
        switch (res) {
            default:
                return "Failed to init system.";
        }
    };
    return PaymentSystemAdapter;
}());
exports["default"] = PaymentSystemAdapter;
