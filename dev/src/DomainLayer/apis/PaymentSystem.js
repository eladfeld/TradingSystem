"use strict";
exports.__esModule = true;
var PaymentSystem = /** @class */ (function () {
    function PaymentSystem() {
    }
    PaymentSystem.nextPaymentId = 1;
    //initializes system. returns a session id or negative number on failure
    PaymentSystem.init = function () {
        return 0;
    };
    //transfers @amount dollars to bank account number @toAccount
    //from credit card with number @cardNumber, expires at DD/MM/YYYY where @expiration=DDMMYYYY, and cvv of @cvv
    //returns the unique payment number necesary for referencing the payment and refunding
    PaymentSystem.transfer = function (cardNumber, expiration, cvv, toAccount, amount) {
        return PaymentSystem.nextPaymentId++;
    };
    //refunds the credit charge with payment id of @paymentId
    //returns negative number if refund not possible
    PaymentSystem.refund = function (paymentId) {
        return true;
    };
    return PaymentSystem;
}());
exports["default"] = PaymentSystem;
