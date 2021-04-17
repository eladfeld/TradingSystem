"use strict";
exports.__esModule = true;
exports.Permission = exports.ACTION = void 0;
//only 2's powers to maintain mask!!!
var ACTION;
(function (ACTION) {
    ACTION[ACTION["APPOINT_MANAGER"] = 1] = "APPOINT_MANAGER";
    ACTION[ACTION["APPOINT_OWNER"] = 2] = "APPOINT_OWNER";
})(ACTION = exports.ACTION || (exports.ACTION = {}));
var Permission = /** @class */ (function () {
    function Permission(permissions_mask) {
        this.permissions_mask = permissions_mask;
    }
    //returns true if this action is permitted
    Permission.prototype.check_action = function (action) {
        if ((this.permissions_mask & action) != 0)
            return true;
        return false;
    };
    Permission.prototype.setPermissions = function (permissions_mask) {
        this.permissions_mask = permissions_mask;
    };
    Permission.prototype.getPermissions = function () {
        return this.permissions_mask;
    };
    return Permission;
}());
exports.Permission = Permission;
