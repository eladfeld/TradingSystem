"use strict";
exports.__esModule = true;
exports.ProductDB = void 0;
var ProductDB = /** @class */ (function () {
    function ProductDB() {
    }
    ProductDB.addProduct = function (product) {
        this.products.push(product);
    };
    ProductDB.addWitheredProduct = function (wproduct) {
        this.products.push(wproduct);
    };
    ProductDB.getProductByName = function (productName) {
        return this.products.find(function (product) { return product.getName() == productName; });
    };
    ProductDB.products = [];
    return ProductDB;
}());
exports.ProductDB = ProductDB;
