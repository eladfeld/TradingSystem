import express from 'express';
import Controller from './Controller';

const router = express.Router();

router.get('/enter', Controller.enter);
router.post('/register', Controller.register)
router.post('/login', Controller.login)
router.post('/exit', Controller.exit)
router.post('/logout', Controller.logout)
router.post('/getStoreInfo', Controller.getStoreInfo)
router.post('/getPruductInfoByName', Controller.getPruductInfoByName)
router.post('/getPruductInfoByCategory', Controller.getPruductInfoByCategory)
router.post('/getPruductInfoAboveRating', Controller.getPruductInfoAboveRating)
router.post('/getPruductInfoBelowPrice', Controller.getPruductInfoBelowPrice)
router.post('/getPruductInfoAbovePrice', Controller.getPruductInfoAbovePrice)
router.post('/addProductTocart', Controller.addProductTocart)
router.post('/getCartInfo', Controller.getCartInfo)
router.post('/editCart', Controller.editCart)
router.post('/checkoutBasket', Controller.checkoutBasket)
router.post('/checkoutSingleProduct', Controller.checkoutSingleProduct)
router.post('/completeOrder', Controller.completeOrder)
router.post('/openStore', Controller.openStore)
router.post('/editStoreInventory', Controller.editStoreInventory)
router.post('/addNewProduct', Controller.addNewProduct)
router.post('/getSubscriberPurchaseHistory', Controller.getSubscriberPurchaseHistory)
router.post('/getStorePurchaseHistory', Controller.getStorePurchaseHistory)
router.post('/deleteManagerFromStore', Controller.deleteManagerFromStore)
router.post('/editStaffPermission', Controller.editStaffPermission)
router.post('/appointStoreOwner', Controller.appointStoreOwner)
router.post('/appointStoreManager', Controller.appointStoreManager)
router.post('/getStoreStaff', Controller.getStoreStaff)
router.post('/getWordList', Controller.getWordList)
router.post('/addDiscountPolicy', Controller.addDiscountPolicy)
router.post('/addBuyingPolicy', Controller.addBuyingPolicy)
router.post('/removeBuyingPolicy', Controller.removeBuyingPolicy)
router.post('/removeDiscountPolicy', Controller.removeDiscountPolicy)
router.post('/getUsername', Controller.getUsername)



export = router;
