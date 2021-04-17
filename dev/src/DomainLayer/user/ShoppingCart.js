"use strict";
exports.__esModule = true;
exports.ShoppingCart = void 0;
var Result_1 = require("../../Result");
var Logger_1 = require("../Logger");
var ShoppingBasket_1 = require("./ShoppingBasket");
var ShoppingCart = /** @class */ (function () {
    function ShoppingCart() {
        this.baskets = new Map();
    }
    ShoppingCart.prototype.buyBasket = function (storeId, paymentMeans, supplyInfo) {
        var basket = this.baskets.get(storeId);
        if (basket === undefined) {
            Logger_1.Logger.error("no such shopping basket");
            return Result_1.makeFailure("no such shopping basket");
        }
        return basket.buyAll(paymentMeans, supplyInfo);
    };
    ShoppingCart.prototype.addProduct = function (storeId, productId, quantity) {
        var basket = this.baskets.get(storeId);
        if (basket === undefined) {
            //TODO: if (shop exist)
            //{
            basket = new ShoppingBasket_1.ShoppingBasket(storeId);
            this.baskets.set(storeId, basket);
            //}
            //else {
            //Logger.error("shop with id ${storeId} does not exist");
            //return -1 (shop doesnt exist);
            //}
        }
        return basket.addProduct(productId, quantity);
    };
    ShoppingCart.prototype.editStoreCart = function (storeId, productId, newQuantity) {
        var basket = this.baskets.get(storeId);
        if (basket === undefined)
            return Result_1.makeFailure("shopping basket doesnt exist");
        return basket.edit(productId, newQuantity);
    };
    ShoppingCart.prototype.getShoppingCart = function () {
        return Array.from(this.baskets.keys());
    };
    ShoppingCart.prototype.getShoppingBasket = function (storeId) {
        return this.baskets.get(storeId).getProducts();
    };
    return ShoppingCart;
}());
exports.ShoppingCart = ShoppingCart;
