"use strict";
exports.__esModule = true;
exports.isFailure = exports.isOk = exports.makeFailure = exports.makeOk = void 0;
var makeOk = function (value) {
    return ({ tag: "Ok", value: value });
};
exports.makeOk = makeOk;
var makeFailure = function (message) {
    return ({ tag: "Failure", message: message });
};
exports.makeFailure = makeFailure;
var isOk = function (r) {
    return r.tag === "Ok";
};
exports.isOk = isOk;
var isFailure = function (r) {
    return r.tag === "Failure";
};
exports.isFailure = isFailure;
