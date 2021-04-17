"use strict";
exports.__esModule = true;
exports.ShoppingBasket = void 0;
var Result_1 = require("../../Result");
var Logger_1 = require("../Logger");
var Purchase_1 = require("../Purchase");
var ShoppingBasket = /** @class */ (function () {
    function ShoppingBasket(storeid) {
        this.products = new Map();
        //TODO: access store database and get the store that have this id
    }
    ShoppingBasket.prototype.getStoreId = function () {
        return this.store.getStoreId();
    };
    ShoppingBasket.prototype.getProducts = function () {
        return this.products;
    };
    ShoppingBasket.prototype.addProduct = function (productId, quantity) {
        if (quantity < 0) {
            Logger_1.Logger.error("quantity can't be negative number");
            return Result_1.makeFailure("quantity can't be negative number");
        }
        if (!this.store.openForImmediateAuction(productId)) {
            Logger_1.Logger.error("product not for immediate auction");
            return Result_1.makeFailure("product not for immediate auction");
        }
        if (!this.store.isProductAvailable(productId, quantity)) {
            Logger_1.Logger.log("product is not available in this quantity");
            return Result_1.makeFailure("product is not available in this quantity");
        }
        var prevQuantity = 0;
        if (this.products.get(productId) != undefined)
            prevQuantity = this.products.get(productId);
        this.products.set(productId, prevQuantity + quantity);
        return Result_1.makeOk("product added to cart");
    };
    ShoppingBasket.prototype.buyAll = function (paymentMeans, supplyInfo) {
        //TODO: sync with purchase about checkout!
        var price = this.store.calculatePrice(this.products);
        return Purchase_1.Purchase.checkout(price, this.store, paymentMeans, supplyInfo);
    };
    ShoppingBasket.prototype.edit = function (productId, newQuantity) {
        if (newQuantity < 0)
            return Result_1.makeFailure("negative quantity");
        if (!this.store.isProductAvailable(productId, newQuantity))
            return Result_1.makeFailure("quantity not available");
        this.products.set(productId, newQuantity);
        if (newQuantity === 0)
            this.products["delete"](productId);
        return Result_1.makeOk("added to cart");
    };
    //------------------------------------functions for tests-------------------------------------
    ShoppingBasket.prototype.clear = function () {
        this.products = new Map();
    };
    ShoppingBasket.prototype.setStore = function (store) {
        this.store = store;
    };
    return ShoppingBasket;
}());
exports.ShoppingBasket = ShoppingBasket;
