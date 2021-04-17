"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
var PaymentInfo_1 = require("../../src/DomainLayer/purchase/PaymentInfo");
var Purchase_1 = require("../../src/DomainLayer/purchase/Purchase");
var Transaction_1 = require("../../src/DomainLayer/purchase/Transaction");
var Common_1 = require("../../src/DomainLayer/store/Common");
var ProductDB_1 = require("../../src/DomainLayer/store/ProductDB");
var Store_1 = require("../../src/DomainLayer/store/Store");
var Subscriber_1 = require("../../src/DomainLayer/user/Subscriber");
var Result_1 = require("../../src/Result");
//checkout should have
var store1Id = 1;
var store1BankAcct = 11223344;
var store1 = new Store_1.Store(0, 'store1', store1Id, "1 sunny ave");
//const store2: Store = new Store(0,'store2',2,"2 sunny ave", 'none', 'none');
var user1Id = 100;
var user1Adrs = "8 Mile Road, Detroit";
var basket1a = new Map([[3000, 3]]);
var basket1b = new Map([[4000, 4]]);
var _a = [30, 40], total1a = _a[0], total1b = _a[1];
var subscriber = new Subscriber_1.Subscriber('Tzuri');
store1.addNewProduct(subscriber, "s3000", [Common_1.Category.COMPUTER], 1, 10);
var prod = ProductDB_1.ProductDB.getProductByName("s3000");
//const productId: number = prod.getProductId();
var payInfo = new PaymentInfo_1.PaymentInfo(12346, 123, 456);
describe('purchase tests', function () {
    it('checkout, without completing order', function () {
        Purchase_1["default"].checkout(store1, total1a, user1Id, basket1a, user1Adrs);
        chai_1.expect(Purchase_1["default"].numTransactionsInProgress(user1Id, store1Id)).to.equal(1);
        chai_1.expect(Purchase_1["default"].hasCheckoutInProgress(user1Id, store1Id)).to.equal(true);
        var transaction = Purchase_1["default"].getTransactionInProgress(user1Id, store1Id);
        chai_1.expect(transaction.getTotal()).to.equal(total1b);
        chai_1.expect(transaction.getItems().get(3000)).to.equal(3);
    });
    it('checkout twice, should override first', function () {
        Purchase_1["default"].checkout(store1, total1a, user1Id, basket1a, user1Adrs);
        Purchase_1["default"].checkout(store1, total1b, user1Id, basket1b, user1Adrs);
        chai_1.expect(Purchase_1["default"].numTransactionsInProgress(user1Id, store1Id)).to.equal(1);
        chai_1.expect(Purchase_1["default"].hasCheckoutInProgress(user1Id, store1Id)).to.equal(true);
        var transaction = Purchase_1["default"].getTransactionInProgress(user1Id, store1Id);
        chai_1.expect(transaction.getTotal()).to.equal(total1b);
        chai_1.expect(transaction.getItems().get(3000)).to.equal(3);
        chai_1.expect(transaction.getItems().get(4000)).to.equal(undefined);
        chai_1.expect(transaction.getStatus()).to.equal(Transaction_1.TransactionStatus.ITEMS_RESERVED);
    });
    it('checkout, then complete order', function () {
        Purchase_1["default"].checkout(store1, total1a, user1Id, basket1a, user1Adrs);
        Purchase_1["default"].CompleteOrder(user1Id, store1Id, payInfo);
        chai_1.expect(Purchase_1["default"].numTransactionsInProgress(user1Id, store1Id)).to.equal(0);
        chai_1.expect(Purchase_1["default"].hasCheckoutInProgress(user1Id, store1Id)).to.equal(false);
        var transactions = Purchase_1["default"].getCompletedTransactions(user1Id, store1Id);
        chai_1.expect(transactions.length).to.equal(1);
        var transaction = transactions[0];
        chai_1.expect(transaction.getItems().get(3000)).to.equal(3);
        chai_1.expect(transaction.getItems().get(4000)).to.equal(undefined);
        chai_1.expect(transaction.getStatus()).to.equal(Transaction_1.TransactionStatus.SUPPLIED);
    });
    it('attempt completing order before checkout', function () {
        //Purchase.checkout(store1, total1a, user1Id, basket1a, user1Adrs);
        chai_1.expect(Purchase_1["default"].numTransactionsInProgress(user1Id, store1Id)).to.equal(0);
        chai_1.expect(Purchase_1["default"].hasCheckoutInProgress(user1Id, store1Id)).to.equal(false);
        var res = Purchase_1["default"].CompleteOrder(user1Id, store1Id, payInfo);
        chai_1.expect(Result_1.isFailure(res)).to.equal(true);
    });
});
