"use strict";
exports.__esModule = true;
exports.BuyingOption = exports.buyingOption = void 0;
var Result_1 = require("../../Result");
var buyingOption;
(function (buyingOption) {
    buyingOption[buyingOption["INSTANT"] = 0] = "INSTANT";
    buyingOption[buyingOption["OFFER"] = 1] = "OFFER";
    buyingOption[buyingOption["BID"] = 2] = "BID";
    buyingOption[buyingOption["RAFFLE"] = 3] = "RAFFLE";
})(buyingOption = exports.buyingOption || (exports.buyingOption = {}));
var BuyingOption = /** @class */ (function () {
    function BuyingOption() {
        this.option = buyingOption.INSTANT;
    }
    BuyingOption.prototype.getBuyingOption = function () {
        return this.option;
    };
    BuyingOption.prototype.setBuyingOption = function (option) {
        if (!Object.values(buyingOption).includes(option)) {
            return Result_1.makeFailure("Received invalid buying option: " + option);
        }
        this.option = option;
        return Result_1.makeOk("Buying option was set");
    };
    return BuyingOption;
}());
exports.BuyingOption = BuyingOption;
