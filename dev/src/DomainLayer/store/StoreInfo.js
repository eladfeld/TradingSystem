"use strict";
exports.__esModule = true;
exports.StoreProductInfo = exports.StoreInfo = void 0;
var StoreInfo = /** @class */ (function () {
    function StoreInfo(storeName, storeId, storeProducts) {
        this.storeName = storeName;
        this.storeId = storeId;
        this.storeProducts = storeProducts;
    }
    StoreInfo.prototype.getStoreProducts = function () {
        return this.storeProducts;
    };
    StoreInfo.prototype.getStoreName = function () {
        return this.storeName;
    };
    StoreInfo.prototype.getStoreId = function () {
        return this.storeId;
    };
    return StoreInfo;
}());
exports.StoreInfo = StoreInfo;
var StoreProductInfo = /** @class */ (function () {
    function StoreProductInfo(productName, productId, price) {
        this.productName = productName;
        this.productId = productId;
        this.price = price;
    }
    StoreProductInfo.prototype.getProductId = function () {
        return this.productId;
    };
    StoreProductInfo.prototype.getName = function () {
        return this.productName;
    };
    StoreProductInfo.prototype.getPrice = function () {
        return this.price;
    };
    return StoreProductInfo;
}());
exports.StoreProductInfo = StoreProductInfo;
