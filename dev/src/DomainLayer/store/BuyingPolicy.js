"use strict";
exports.__esModule = true;
exports.BuyingPolicy = void 0;
var BuyingOption_1 = require("./BuyingOption");
var BuyingPolicy = /** @class */ (function () {
    function BuyingPolicy(buyingPolicy) {
        if (buyingPolicy === void 0) { buyingPolicy = BuyingPolicy["default"]; }
        this.buyingPolicy = buyingPolicy;
        this.buyingOptions = [new BuyingOption_1.BuyingOption()];
    }
    BuyingPolicy.prototype.setBuyingOptions = function (buyingOptions) {
        this.buyingOptions = buyingOptions;
    };
    BuyingPolicy.prototype.hasBuyingOption = function (option) {
        return this.buyingOptions.some(function (buyingOption) { return buyingOption.getBuyingOption() === option; });
    };
    BuyingPolicy["default"] = 'No buying policy';
    return BuyingPolicy;
}());
exports.BuyingPolicy = BuyingPolicy;
