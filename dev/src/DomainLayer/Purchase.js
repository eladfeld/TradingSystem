"use strict";
exports.__esModule = true;
exports.Purchase = void 0;
var Result_1 = require("../Result");
var Purchase = /** @class */ (function () {
    function Purchase() {
    }
    Purchase.checkout = function (price, store, paymentMeans, supplyInfo) {
        return Result_1.makeFailure("not yet implemented");
    };
    return Purchase;
}());
exports.Purchase = Purchase;
