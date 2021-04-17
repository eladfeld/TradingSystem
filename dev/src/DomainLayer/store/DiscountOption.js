"use strict";
exports.__esModule = true;
exports.DiscountOption = exports.discountOption = void 0;
var discountOption;
(function (discountOption) {
    discountOption[discountOption["VISIBLE"] = 1] = "VISIBLE";
    discountOption[discountOption["CONDITIONAL"] = 2] = "CONDITIONAL";
    discountOption[discountOption["HIDDEN"] = 3] = "HIDDEN";
})(discountOption = exports.discountOption || (exports.discountOption = {}));
var DiscountOption = /** @class */ (function () {
    function DiscountOption(percent, dateFrom, dateUntil, option) {
        if (option === void 0) { option = discountOption.VISIBLE; }
        this.option = discountOption.VISIBLE;
        this.dateFrom = dateFrom;
        this.dateUntil = dateUntil;
        this.percent = percent;
    }
    DiscountOption.prototype.getOption = function () {
        return this.option;
    };
    DiscountOption.prototype.getDateFrom = function () {
        return this.dateFrom;
    };
    DiscountOption.prototype.getDateUntil = function () {
        return this.dateUntil;
    };
    DiscountOption.prototype.getPercent = function () {
        return this.percent;
    };
    return DiscountOption;
}());
exports.DiscountOption = DiscountOption;
;
