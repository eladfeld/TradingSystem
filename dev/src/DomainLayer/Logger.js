"use strict";
exports.__esModule = true;
exports.Logger = void 0;
var fs_1 = require("fs");
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.prototype.Logger = function () { };
    Logger.log = function (message) {
        var date = new Date();
        fs_1["default"].appendFile('logger.log', date + " : " + message + "\n", function (err) {
            if (err) {
                console.log("error in log.error: " + err);
            }
        });
    };
    Logger.error = function (massage) {
        fs_1["default"].appendFile('error.log', new Date() + " : error: " + massage + "\n", function (err) {
            if (err) {
                console.log("error in log.log: " + err);
            }
        });
    };
    return Logger;
}());
exports.Logger = Logger;
