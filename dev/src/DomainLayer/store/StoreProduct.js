"use strict";
exports.__esModule = true;
exports.StoreProduct = void 0;
var Result_1 = require("../../Result");
var Logger_1 = require("../Logger");
var Common_1 = require("./Common");
var StoreProduct = /** @class */ (function () {
    function StoreProduct(productId, name, price, storeId, quantity) {
        this.productId = productId;
        this.name = name;
        this.price = price;
        this.storeId = storeId;
        this.quantity = quantity;
        this.productRating = 0; // getting productRating with numOfRaters = 0 will return NaN
        this.numOfRaters = 0;
    }
    StoreProduct.prototype.getProductId = function () {
        return this.productId;
    };
    StoreProduct.prototype.getName = function () {
        return this.name;
    };
    StoreProduct.prototype.getStoreId = function () {
        return this.storeId;
    };
    StoreProduct.prototype.getPrice = function () {
        return this.price;
    };
    StoreProduct.prototype.getQuantity = function () {
        return this.quantity;
    };
    StoreProduct.prototype.setQuantity = function (quantity) {
        if (quantity < 0) {
            Logger_1.Logger.error("Quantity has to be non negative");
            return Result_1.makeFailure("Quantity has to be non negative");
        }
        this.quantity = quantity;
        Logger_1.Logger.log("New quantity was set, Product Name: " + this.name + ", New Quantity: " + this.quantity + "\n");
        return Result_1.makeOk("New quantity was set, Product Name: " + this.name + ", New Quantity: " + this.quantity + "\n");
    };
    StoreProduct.prototype.addQuantity = function (amount) {
        if (amount < 0) {
            Logger_1.Logger.error("Amount has to be non negative");
            return Result_1.makeFailure("Amount has to be non negative");
        }
        this.quantity = this.quantity + amount;
        Logger_1.Logger.log("New quantity was added, Product Name: " + this.name + ", New Quantity: " + this.quantity + "\n");
        return Result_1.makeOk("New quantity was added, Product Name: " + this.name + ", New Quantity: " + this.quantity + "\n");
    };
    StoreProduct.prototype.addProductRating = function (rating) {
        if (!Object.values(Common_1.Rating).includes(rating)) {
            Logger_1.Logger.error("Got invalid rating " + ("" + rating));
            return Result_1.makeFailure("Got invalid rating");
        }
        this.productRating *= this.numOfRaters;
        this.numOfRaters++;
        this.productRating += rating;
        this.productRating /= this.numOfRaters;
        Logger_1.Logger.log("Rating was added new product rating: " + this.productRating);
        return Result_1.makeOk("Rating was added ");
    };
    StoreProduct.prototype.getProductRating = function () {
        if (this.numOfRaters > 0) {
            return this.productRating;
        }
        return NaN;
    };
    return StoreProduct;
}());
exports.StoreProduct = StoreProduct;
