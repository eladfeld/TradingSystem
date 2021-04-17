"use strict";
exports.__esModule = true;
var PaymentInfo = /** @class */ (function () {
    function PaymentInfo(cardNumber, cvv, expiration) {
        var _this = this;
        this.getCardNumber = function () { return _this.cardNumber; };
        this.getCvv = function () { return _this.cvv; };
        this.getExpiration = function () { return _this.expiration; };
        this.cardNumber = cardNumber;
        this.cvv = cvv;
        this.expiration = expiration;
    }
    return PaymentInfo;
}());
exports["default"] = PaymentInfo;
