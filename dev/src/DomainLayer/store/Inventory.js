"use strict";
exports.__esModule = true;
exports.Inventory = void 0;
var StoreProduct_1 = require("./StoreProduct");
var Logger_1 = require("../Logger");
var Result_1 = require("../../Result");
var ProductDB_1 = require("./ProductDB");
var Product_1 = require("./Product");
var StoreInfo_1 = require("./StoreInfo");
var Inventory = /** @class */ (function () {
    function Inventory() {
        this.products = new Map();
    }
    Inventory.prototype.addNewProduct = function (productName, category, storeId, price, quantity) {
        if (quantity === void 0) { quantity = 0; }
        if (quantity < 0) {
            Logger_1.Logger.error("Quantity must be non negative");
            return Result_1.makeFailure("Quantity must be non negative");
        }
        if (price < 0) {
            Logger_1.Logger.error("Price must be non negative");
            return Result_1.makeFailure("Price must be non negative");
        }
        if (this.hasProductWithName(productName).tag == "Failure") {
            Logger_1.Logger.error("Product already exist in inventory!");
            return Result_1.makeFailure("Product already exist in inventory!");
        }
        var product = ProductDB_1.ProductDB.getProductByName(productName);
        if (product === undefined) {
            var product_1 = new Product_1.Product(productName, category);
        }
        var productId = ProductDB_1.ProductDB.getProductByName(productName).getProductId();
        var storeProduct = new StoreProduct_1.StoreProduct(productId, productName, storeId, price, quantity);
        this.products.set(storeProduct.getProductId(), storeProduct);
        Logger_1.Logger.log("Product was added ProductId: " + productId + ", ProductName: " + productName + ", StoreId: " + storeId);
        return Result_1.makeOk("Product was added");
    };
    Inventory.prototype.addProductQuantity = function (productId, quantity) {
        var product = this.products.get(productId);
        if (product === undefined) {
            Logger_1.Logger.error("Product does not exist in inventory!");
            return Result_1.makeFailure("Product does not exist in inventory!");
        }
        product.addQuantity(quantity);
        return Result_1.makeOk("Quantity was added");
    };
    Inventory.prototype.setProductQuantity = function (productId, quantity) {
        var product = this.products.get(productId);
        if (product === undefined) {
            Logger_1.Logger.error("Product does not exist in inventory!");
            return Result_1.makeFailure("Product does not exist in inventory!");
        }
        product.setQuantity(quantity);
        return Result_1.makeOk("Quantity was set");
    };
    Inventory.prototype.isProductAvailable = function (productId, quantity) {
        var product = this.products.get(productId);
        if (product === undefined) {
            Logger_1.Logger.error("Product does not exist in inventory!");
            return Result_1.makeFailure("Product does not exist in inventory!");
        }
        if (product.getQuantity() >= quantity) {
            return Result_1.makeOk("Product is available");
        }
        return;
    };
    Inventory.prototype.hasProductWithName = function (productName) {
        for (var _i = 0, _a = this.products.values(); _i < _a.length; _i++) {
            var product = _a[_i];
            if (product.getName() === productName) {
                return Result_1.makeOk("Has product with name");
            }
        }
        return Result_1.makeFailure("Doesn't have product with name");
    };
    Inventory.prototype.reserveProduct = function (productId, quantity) {
        var result = this.isProductAvailable(productId, quantity);
        if (Result_1.isFailure(result)) {
            return result;
        }
        var product = this.products.get(productId);
        product.setQuantity(product.getQuantity() - quantity);
        Logger_1.Logger.log("Product reserved Product name: " + product.getName + ", Quantity reserved: " + quantity);
        return Result_1.makeOk('Product reserved');
    };
    Inventory.prototype.returnReservedProduct = function (productId, quantity) {
        if (!this.products.has(productId)) {
            return Result_1.makeFailure("No product with id" + (" " + productId) + " found");
        }
        var product = this.products.get(productId);
        product.addQuantity(quantity);
        Logger_1.Logger.log("Product returned Product name: " + product.getName + ", Quantity returned: " + quantity);
        return Result_1.makeOk('Product returned');
    };
    Inventory.prototype.getProductsInfo = function () {
        var storeProducts = [];
        for (var _i = 0, _a = this.products.values(); _i < _a.length; _i++) {
            var storeProduct = _a[_i];
            storeProducts.push(new StoreInfo_1.StoreProductInfo(storeProduct.getName(), storeProduct.getProductId(), storeProduct.getPrice()));
        }
        return storeProducts;
    };
    Inventory.prototype.getProductPrice = function (productId) {
        var product = this.products.get(productId);
        if (product === undefined) {
            return -1;
        }
        return product.getPrice();
    };
    return Inventory;
}());
exports.Inventory = Inventory;
