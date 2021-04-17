"use strict";
exports.__esModule = true;
exports.Product = void 0;
var Common_1 = require("./Common");
var ProductDB_1 = require("./ProductDB");
var Product = /** @class */ (function () {
    function Product(name, category) {
        this.productId = Common_1.ID();
        this.name = name;
        this.category = category;
        ProductDB_1.ProductDB.addProduct(this);
    }
    Product.prototype.getProductId = function () {
        return this.productId;
    };
    Product.prototype.getName = function () {
        return this.name;
    };
    return Product;
}());
exports.Product = Product;
