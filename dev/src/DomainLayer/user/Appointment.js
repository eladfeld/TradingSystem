"use strict";
exports.__esModule = true;
exports.Appointment = exports.JobTitle = void 0;
var Result_1 = require("../../Result");
var Logger_1 = require("../Logger");
var Permission_1 = require("./Permission");
var JobTitle;
(function (JobTitle) {
    JobTitle["FOUNDER"] = "founder";
    JobTitle["MANAGER"] = "manager";
    JobTitle["OWNER"] = "owner";
})(JobTitle = exports.JobTitle || (exports.JobTitle = {}));
var Appointment = /** @class */ (function () {
    function Appointment(appointer, store, appointee, permission, title) {
        this.appointee = appointee;
        this.appointer = appointer;
        this.store = store;
        this.permission = permission;
        this.title = title;
    }
    Appointment.appoint_founder = function (founder, store) {
        if (founder === undefined || store === undefined) {
            Logger_1.Logger.error("undefined arrgument given");
            return Result_1.makeFailure("undefined arrgument given");
        }
        if (founder.getUserId() === store.getStoreFounderId()) {
            // -1 meens 0xFFFFFFF -> so all bits in the mask are turn to 1 and all the actions are permited
            var allGrantedPermission = new Permission_1.Permission(-1);
            var new_appointment = new Appointment(founder, store, founder, allGrantedPermission, JobTitle.FOUNDER);
            store.addAppointment(new_appointment);
            founder.addAppointment(new_appointment);
            Logger_1.Logger.log("the subscriber " + founder.getUsername + " is now appointed to be a new store founder at " + store.getStoreId);
            return Result_1.makeOk("appointment made successfully");
        }
        Logger_1.Logger.error("the candidate is not the store founder");
        return Result_1.makeFailure("the candidate is not the store founder");
    };
    Appointment.appoint_owner = function (appointer, store, appointee, permission) {
        if (appointer === undefined || store === undefined || appointee === undefined || permission === undefined) {
            Logger_1.Logger.error("undefined arrgument given");
            return Result_1.makeFailure("undefined arrgument given");
        }
        //check if appointer is allowed to appoint owner
        if (appointer.checkIfPerrmited(Permission_1.ACTION.APPOINT_OWNER, store)) {
            var title = appointee.getTitle(store.getStoreId());
            if (title != JobTitle.OWNER && title != JobTitle.FOUNDER) //this 'if' deals with cyclic appointments
             {
                return this.appointTitle(appointer, store, appointee, permission, JobTitle.OWNER);
            }
        }
        return Result_1.makeFailure("unauthorized try to appoint owner");
    };
    Appointment.appoint_manager = function (appointer, store, appointee, permission) {
        if (appointer === undefined || store === undefined || appointee === undefined || permission === undefined) {
            Logger_1.Logger.error("appoint_manager: undefined arrgument given");
            return Result_1.makeFailure("undefined arrgument given");
        }
        //check if appointer is allowed to appoint manager
        if (appointer.checkIfPerrmited(Permission_1.ACTION.APPOINT_MANAGER, store)) {
            var title = appointee.getTitle(store.getStoreId());
            if (title != JobTitle.OWNER && title != JobTitle.MANAGER && title != JobTitle.FOUNDER) //this 'if' deals with cyclic appointments
             {
                return this.appointTitle(appointer, store, appointee, permission, JobTitle.MANAGER);
            }
            else {
                return Result_1.makeFailure("user already appointed");
            }
        }
        return Result_1.makeFailure("unauthorized try to appoint manager");
    };
    Appointment.appointTitle = function (appointer, store, appointee, permission, title) {
        var store_app = appointee.getStoreapp(store.getStoreId());
        // no previous appointments
        if (store_app === undefined) {
            var new_appointment = new Appointment(appointer, store, appointee, permission, title);
            store.addAppointment(new_appointment);
            appointee.addAppointment(new_appointment);
        }
        else //there is old appointment to this user remove old and replace with new appointment (save old permissions)
         {
            var prev_permission = store_app.getPermissions();
            var new_permission_mask = prev_permission.getPermissions() | permission.getPermissions();
            appointee.deleteAppointment(store_app);
            store.deleteAppointment(store_app);
            var new_appointment = new Appointment(appointer, store, appointee, new Permission_1.Permission(new_permission_mask), title);
            store.addAppointment(new_appointment);
            appointee.addAppointment(new_appointment);
        }
        Logger_1.Logger.log("the subscriber " + appointee.getUsername + " is now appointed to be a new store " + title + " at " + store.getStoreId);
        return Result_1.makeOk("appointment made successfully");
    };
    Appointment.removeAppointment = function (appointment) {
        var _this = this;
        appointment.appointee.deleteAppointment(appointment);
        appointment.store.deleteAppointment(appointment);
        var appointee = appointment.appointee;
        appointment.store.getAppointments().forEach(function (appointment) {
            if (appointment.appointer === appointee)
                _this.removeAppointment(appointment);
        });
    };
    Appointment.prototype.getStore = function () {
        return this.store;
    };
    Appointment.prototype.getPermissions = function () {
        return this.permission;
    };
    Appointment.prototype.getTitle = function () {
        return this.title;
    };
    return Appointment;
}());
exports.Appointment = Appointment;
