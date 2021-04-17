"use strict";
exports.__esModule = true;
exports.DiscountPolicy = void 0;
var DiscountPolicy = /** @class */ (function () {
    function DiscountPolicy(discountPolicy) {
        if (discountPolicy === void 0) { discountPolicy = DiscountPolicy["default"]; }
        this.discountPolicy = discountPolicy;
        this.discounts = [];
    }
    DiscountPolicy.prototype.addDiscountOption = function (discountOptions) {
        this.discounts.push(discountOptions);
    };
    DiscountPolicy.prototype.applyDiscountPolicy = function (productMap) {
        var totalPrice = 0;
        var activeDiscountPercents = [];
        var now = new Date();
        now.setHours(0, 0, 0, 0);
        for (var _i = 0, _a = this.discounts; _i < _a.length; _i++) {
            var discount = _a[_i];
            if (discount.getDateFrom() <= now && discount.getDateUntil() >= now) {
                //TODO: check for conditional discount predicats
                activeDiscountPercents.push(discount.getPercent());
            }
        }
        for (var _b = 0, productMap_1 = productMap; _b < productMap_1.length; _b++) {
            var _c = productMap_1[_b], productPrice = _c[0], quantity = _c[1];
            var discountPrice = productPrice;
            for (var _d = 0, activeDiscountPercents_1 = activeDiscountPercents; _d < activeDiscountPercents_1.length; _d++) {
                var discount = activeDiscountPercents_1[_d];
                discountPrice *= ((100 - discount) / 100);
            }
            totalPrice += discountPrice;
        }
        return totalPrice;
    };
    DiscountPolicy["default"] = 'No discount policy';
    return DiscountPolicy;
}());
exports.DiscountPolicy = DiscountPolicy;
