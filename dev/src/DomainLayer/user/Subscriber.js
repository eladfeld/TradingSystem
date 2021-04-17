"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Subscriber = void 0;
var User_1 = require("./User");
var Subscriber = /** @class */ (function (_super) {
    __extends(Subscriber, _super);
    function Subscriber(username) {
        var _this = _super.call(this) || this;
        _this.username = username;
        _this.appointments = [];
        return _this;
    }
    Subscriber.prototype.isSystemManager = function () {
        return true;
    };
    Subscriber.prototype.setPassword = function (hashPassword) {
        this.hashPassword = hashPassword;
    };
    Subscriber.prototype.getUsername = function () {
        return this.username;
    };
    Subscriber.prototype.getPassword = function () {
        return this.hashPassword;
    };
    Subscriber.prototype.printUser = function () {
        return "username: " + this.username;
    };
    Subscriber.prototype.addAppointment = function (appointment) {
        this.appointments.push(appointment);
    };
    // returns an appointments of current user to storeId if exists
    Subscriber.prototype.getStoreapp = function (storeId) {
        return this.appointments.find(function (appointment) { return appointment.getStore().getStoreId() === storeId; });
    };
    //returns true if this subscriber perform this <action> on this <store>
    Subscriber.prototype.checkIfPerrmited = function (action, store) {
        var store_app = this.getStoreapp(store.getStoreId());
        if (store_app != undefined)
            if (store_app.getPermissions().check_action(action))
                return true;
        return false;
    };
    Subscriber.prototype.getTitle = function (storeId) {
        var app = this.appointments.find(function (appointment) { return appointment.getStore().getStoreId() === storeId; });
        if (app != undefined)
            return app.getTitle();
        return undefined;
    };
    Subscriber.prototype.deleteAppointment = function (store_app) {
        this.appointments = this.appointments.filter(function (app) { return app !== store_app; });
    };
    //-----------------------------functions for tests---------------------------------------------
    Subscriber.prototype.getAppointments = function () {
        return this.appointments;
    };
    return Subscriber;
}(User_1.User));
exports.Subscriber = Subscriber;
