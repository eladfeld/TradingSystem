"use strict";
exports.__esModule = true;
var SupplySystem = /** @class */ (function () {
    function SupplySystem() {
    }
    SupplySystem.nextReservationId = 1;
    //initializes system. returns a session id or negative number on failure
    SupplySystem.init = function () {
        return 0;
    };
    //reserves a shipment from @from to @to and @returns a unique shipment reservation number
    //this reservation number is needed for canceling and supplying the reservation
    SupplySystem.reserve = function (from, to) {
        return SupplySystem.nextReservationId++;
    };
    //cancels the shipping reservation with id @reservationId and @returns true if suceeded
    //after calling this function, calling cancel/supply for the same reservation id will fail and return false
    SupplySystem.cancelReservation = function (reservationId) {
        return true;
    };
    //finalizes the shipping order with reservation id @reservationId
    //after calling this function, calling cancel/supply for the same reservation id will fail and return false
    SupplySystem.supply = function (reservationId) {
        return true;
    };
    return SupplySystem;
}());
exports["default"] = SupplySystem;
