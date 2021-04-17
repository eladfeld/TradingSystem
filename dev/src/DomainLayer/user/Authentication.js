"use strict";
exports.__esModule = true;
exports.SubscriberData = void 0;
var crypto_1 = require("crypto");
var SubscriberData = /** @class */ (function () {
    function SubscriberData() {
    }
    SubscriberData.addSubscriber = function (subscriber, password) {
        var hashedPass = crypto_1.createHash('sha1').update(password).digest('hex');
        subscriber.setPassword(hashedPass);
        this.subscribers.push(subscriber);
    };
    SubscriberData.clean = function () {
        this.subscribers = [];
    };
    SubscriberData.checkedUsedUserName = function (username) {
        return this.subscribers.some(function (user) { return user.getUsername() === username; });
    };
    SubscriberData.getSubscriber = function (username) {
        return this.subscribers.find(function (user) { return user.getUsername() === username; });
    };
    SubscriberData.checkPassword = function (username, password) {
        var hashedPass = crypto_1.createHash('sha1').update(password).digest('hex');
        return this.subscribers.some(function (user) { return user.getUsername() === username && user.getPassword() === hashedPass; });
    };
    SubscriberData.subscribers = [];
    return SubscriberData;
}());
exports.SubscriberData = SubscriberData;
