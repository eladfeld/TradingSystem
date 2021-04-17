"use strict";
exports.__esModule = true;
exports.User = void 0;
var Result_1 = require("../../Result");
var ShoppingCart_1 = require("./ShoppingCart");
var User = /** @class */ (function () {
    function User() {
        this.editCart = function (storeId, productId, newQuantity) {
            return Result_1.makeOk(true);
        };
        this.shoppingCart = new ShoppingCart_1.ShoppingCart();
        this.userId = User.lastId++;
    }
    User.getLastId = function () {
        return 0;
    };
    User.prototype.buyBasket = function (shopId, paymentMeans, supplyInfo) {
        return this.shoppingCart.buyBasket(shopId, paymentMeans, supplyInfo);
    };
    User.prototype.buyProduct = function (productId, shopId, buying_option) {
        //TODO: but a single product 
        return Result_1.makeFailure("not yet implemented");
    };
    User.prototype.addProductToShoppingCart = function (storeId, productId, quntity) {
        return this.shoppingCart.addProduct(storeId, productId, quntity);
    };
    User.prototype.GetShoppingCart = function () {
        return this.shoppingCart.getShoppingCart();
    };
    User.prototype.getShoppingBasket = function (storeId) {
        return this.shoppingCart.getShoppingBasket(storeId);
    };
    User.prototype.getUserId = function () {
        return this.userId;
    };
    User.lastId = User.getLastId();
    return User;
}());
exports.User = User;
//TODO: override buyBasket in subscriber and add to user history there!
