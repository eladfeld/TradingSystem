"use strict";
exports.__esModule = true;
exports.Store = void 0;
var DiscountPolicy_1 = require("./DiscountPolicy");
var BuyingPolicy_1 = require("./BuyingPolicy");
var Inventory_1 = require("./Inventory");
var Common_1 = require("./Common");
var Appointment_1 = require("../user/Appointment");
var Result_1 = require("../../Result");
var StoreHistory_1 = require("./StoreHistory");
var StoreDB_1 = require("./StoreDB");
var StoreInfo_1 = require("./StoreInfo");
var Logger_1 = require("../Logger");
var BuyingOption_1 = require("./BuyingOption");
var Purchase_1 = require("../purchase/Purchase");
//import { Authentication } from "../user/Authentication";
var Store = /** @class */ (function () {
    function Store(storeFounderId, storeName, bankAccount, storeAddress, discountPolicy, buyingPolicy) {
        var _this = this;
        if (discountPolicy === void 0) { discountPolicy = DiscountPolicy_1.DiscountPolicy["default"]; }
        if (buyingPolicy === void 0) { buyingPolicy = BuyingPolicy_1.BuyingPolicy["default"]; }
        this.getStoreAddress = function () { return _this.storeAddress; };
        this.buyingOptionsMenu = [this.buyInstant, this.buyOffer, this.buyBid, this.buyRaffle];
        this.storeId = Common_1.ID();
        this.storeName = storeName;
        this.storeFounderId = storeFounderId;
        this.discountPolicy = new DiscountPolicy_1.DiscountPolicy(discountPolicy);
        this.buyingPolicy = new BuyingPolicy_1.BuyingPolicy(buyingPolicy);
        this.inventory = new Inventory_1.Inventory();
        this.messages = new Map();
        this.storeHistory = new StoreHistory_1.StoreHistory(this.storeId, this.storeName, Date.now());
        this.storeRating = 0; // getting storeRating with numOfRaters = 0 will return NaN
        this.numOfRaters = 0;
        this.bankAccount = bankAccount;
        this.storeAddress = storeAddress;
        this.storeClosed = false;
        this.appointments = [];
        StoreDB_1.StoreDB.addStore(this);
    }
    Store.prototype.getStoreFounderId = function () {
        return this.storeFounderId;
    };
    Store.prototype.getStoreId = function () {
        return this.storeId;
    };
    Store.prototype.getStoreName = function () {
        return this.storeName;
    };
    Store.prototype.setStoreId = function (id) {
        this.storeId = id;
    };
    Store.prototype.addStoreRating = function (rating) {
        if (!Object.values(Common_1.Rating).includes(rating)) {
            Logger_1.Logger.error("Got invalid rating " + rating);
            return Result_1.makeFailure("Got invalid rating");
        }
        this.storeRating *= this.numOfRaters;
        this.numOfRaters++;
        this.storeRating += rating;
        this.storeRating /= this.numOfRaters;
        Logger_1.Logger.log("Rating was added new store rating: " + this.storeRating);
        return Result_1.makeOk("Rating was added ");
    };
    Store.prototype.getStoreRating = function () {
        if (this.numOfRaters > 0) {
            return this.storeRating;
        }
        return NaN;
    };
    Store.prototype.isProductAvailable = function (productId, quantity) {
        if (this.storeClosed) {
            return Result_1.makeFailure("Store is closed");
        }
        return this.inventory.isProductAvailable(productId, quantity);
    };
    Store.prototype.addNewProduct = function (productName, category, price, quantity) {
        if (quantity === void 0) { quantity = 0; }
        if (this.storeClosed) {
            return Result_1.makeFailure("Store is closed");
        }
        // we should check who calls this method is authorized
        return this.inventory.addNewProduct(productName, category, this.storeId, price, quantity);
    };
    Store.prototype.sellShoppingBasket = function (buyerId, userAddress, shoppingBasket) {
        if (this.storeClosed) {
            return Result_1.makeFailure("Store is closed");
        }
        var productList = shoppingBasket.getProducts();
        var reservedProducts = new Map();
        var pricesToQuantity = new Map();
        for (var _i = 0, productList_1 = productList; _i < productList_1.length; _i++) {
            var _a = productList_1[_i], id = _a[0], quantity = _a[1];
            var sellResult = this.inventory.reserveProduct(id, quantity);
            var productPrice = this.inventory.getProductPrice(id);
            if (Result_1.isOk(sellResult) && productPrice != -1) {
                reservedProducts.set(id, quantity);
                pricesToQuantity.set(productPrice, quantity);
            }
            else {
                for (var _b = 0, reservedProducts_1 = reservedProducts; _b < reservedProducts_1.length; _b++) {
                    var _c = reservedProducts_1[_b], id_1 = _c[0], quantity_1 = _c[1];
                    this.inventory.returnReservedProduct(id_1, quantity_1);
                }
                return sellResult;
            }
        }
        var fixedPrice = this.discountPolicy.applyDiscountPolicy(pricesToQuantity);
        Purchase_1["default"].checkout(this, fixedPrice, buyerId, reservedProducts, userAddress);
        return Result_1.makeOk("Checkout passed to purchase");
    };
    Store.prototype.cancelReservedShoppingBasket = function (basket) {
        return Result_1.makeFailure("Not implemented");
    };
    Store.prototype.completedTransaction = function (transaction) {
        this.storeHistory.saveTransaction(transaction);
    };
    Store.prototype.getStoreHistory = function () {
        return this.storeHistory;
    };
    Store.prototype.sellProduct = function (buyerId, userAddr, productId, quantity, buyingOption) {
        if (this.storeClosed) {
            return Result_1.makeFailure("Store is closed");
        }
        if (buyingOption.getBuyingOption() < this.buyingOptionsMenu.length && buyingOption.getBuyingOption() >= 0) {
            return this.buyingOptionsMenu[buyingOption.getBuyingOption()](productId, quantity, buyerId, userAddr);
        }
        return Result_1.makeFailure("Invalid buying option");
    };
    Store.prototype.buyInstant = function (productId, quantity, buyerId, userAddress) {
        if (!this.buyingPolicy.hasBuyingOption(BuyingOption_1.buyingOption.INSTANT)) {
            return Result_1.makeFailure("Store does not support instant buying option");
        }
        var sellResult = this.inventory.reserveProduct(productId, quantity);
        if (Result_1.isFailure(sellResult)) {
            return sellResult;
        }
        var productMap = new Map(); // map price to quantity
        var productPrice = this.inventory.getProductPrice(productId);
        if (productPrice === -1) {
            return Result_1.makeFailure("Product was not found");
        }
        productMap.set(productPrice, quantity);
        var fixedPrice = this.discountPolicy.applyDiscountPolicy(productMap);
        Purchase_1["default"].checkout(this, fixedPrice, buyerId, productMap, userAddress);
        return Result_1.makeOk("Checkout passed to purchase");
    };
    Store.prototype.buyOffer = function () {
        return Result_1.makeFailure("Not implemented");
    };
    Store.prototype.buyBid = function () {
        return Result_1.makeFailure("Not implemented");
    };
    Store.prototype.buyRaffle = function () {
        return Result_1.makeFailure("Not implemented");
    };
    Store.prototype.closeStore = function (userId) {
        // this is irreversible
        if (this.getTitle(userId) != Appointment_1.JobTitle.FOUNDER) {
            return Result_1.makeFailure("Not permitted user");
        }
        this.storeClosed = true;
        StoreDB_1.StoreDB.deleteStore(this.storeId);
    };
    Store.prototype.recieveMessage = function (userId, message) {
        return Result_1.makeFailure("Not implemented");
        // if(this.messages.has(userId)){
        //     this.messages.set(userId, this.messages.get(userId) + message)
        // } else {
        //     this.messages.set(userId, message)
        // }
        // return makeOk("Message recieved")
    };
    Store.prototype.readMessages = function (userId) {
        // if(userId is authorized)
        // also add message class and keep track of read and answered messages, enable reading only unread messages or
        // a number of messages
        return Result_1.makeFailure("Not implemented");
    };
    Store.prototype.ansewrMessage = function (userId, answer) {
        // send answer somehow to user with userId
        return Result_1.makeFailure("Not implemented");
    };
    Store.prototype.getStoreInfo = function () {
        return new StoreInfo_1.StoreInfo(this.getStoreName(), this.getStoreId(), this.inventory.getProductsInfo());
    };
    Store.prototype.addAppointment = function (appointment) {
        this.appointments.push(appointment);
    };
    Store.prototype.deleteAppointment = function (appointment) {
        this.appointments = this.appointments.filter(function (app) { return app !== appointment; });
    };
    Store.prototype.getAppointments = function () {
        return this.appointments;
    };
    Store.prototype.getTitle = function (userId) {
        var _this = this;
        var app = this.appointments.find(function (appointment) {
            appointment.getAppointee().getUserId() === userId && appointment.getStore().storeId === _this.storeId;
        });
        if (app != undefined)
            return app.getTitle();
        return undefined;
    };
    Store.prototype.openForImmediateBuy = function (productId) { return true; };
    return Store;
}());
exports.Store = Store;
