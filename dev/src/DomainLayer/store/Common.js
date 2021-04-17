"use strict";
exports.__esModule = true;
exports.Rating = exports.ID = void 0;
// Use:
//
//     var privateID = ID();
var ID = function () {
    return Date.now();
};
exports.ID = ID;
var Rating;
(function (Rating) {
    Rating[Rating["DREADFUL"] = 1] = "DREADFUL";
    Rating[Rating["BAD"] = 2] = "BAD";
    Rating[Rating["OK"] = 3] = "OK";
    Rating[Rating["GOOD"] = 4] = "GOOD";
    Rating[Rating["AMAZING"] = 5] = "AMAZING";
})(Rating = exports.Rating || (exports.Rating = {}));
