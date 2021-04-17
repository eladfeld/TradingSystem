"use strict";
exports.__esModule = true;
var Result_1 = require("../../Result");
var SupplySystem_1 = require("../apis/SupplySystem");
var SupplySystemAdapter = /** @class */ (function () {
    function SupplySystemAdapter() {
        this.init = function () {
            var res = SupplySystem_1["default"].init();
            if (res < 0) //failed to init
                return Result_1.makeFailure(SupplySystemAdapter.initResToMessage(res));
            return Result_1.makeOk(res);
        };
        this.supply = function (reservationId) {
            return SupplySystem_1["default"].supply(reservationId);
        };
        this.reserve = function (shippingInfo) {
            return SupplySystem_1["default"].reserve(shippingInfo.storeAddress, shippingInfo.userAddress);
        };
        this.cancelReservation = function (reservationId) {
            return SupplySystem_1["default"].cancelReservation(reservationId);
        };
    }
    SupplySystemAdapter.initResToMessage = function (res) {
        switch (res) {
            default:
                return "Failed to init system.";
        }
    };
    return SupplySystemAdapter;
}());
exports["default"] = SupplySystemAdapter;
