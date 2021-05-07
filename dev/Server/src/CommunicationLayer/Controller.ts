import { Service } from '../ServiceLayer/Service';
import {Request, Response, NextFunction} from 'express';
import { isOk, Result } from '../Result';
import { Subscriber } from '../DomainLayer/user/Subscriber';
import PaymentInfo from '../DomainLayer/purchase/PaymentInfo';
import { Store } from '../DomainLayer/store/Store';
import Transaction from '../DomainLayer/purchase/Transaction';

const service: Service = Service.get_instance();
const OKSTATUS: number = 200;
const FAILSTATUS: number = 201;


const enter = (req: Request, res: Response, next: NextFunction) =>
{
    let promise: Promise<number> = service.enter();
    promise.then( userId => {
        return res.status(OKSTATUS).json({
            userId: userId}); 
        }).catch( message => {
        return res.status(FAILSTATUS).json({
            error: MessageChannel
        })
    })
}

const register = (req: Request, res: Response, next: NextFunction) =>
{
    let username: string = req.body.username;
    let password: string = req.body.password;
    let age: number = req.body.age;
    let promise = service.register(username, password, age);
    promise.then(
        message =>
        {
            res.status(OKSTATUS).json({
                message
        })})
    .catch(
        message =>
        {
            res.status(FAILSTATUS).json({
                error: message 
        })}
    )
}



//TODO: change the result so it wont sand back a subscriber
const login = (req: Request, res: Response, next: NextFunction) =>
{
    let oldId: number = req.body.userId;
    let username: string = req.body.username;
    let password: string = req.body.password;
    let promise: Promise<Subscriber> = service.login(oldId, username, password);
    promise.then ( subscriber => {
        res.status(OKSTATUS).json({
            userId: subscriber.getUserId(),
            username: subscriber.getUsername()
        })}
        ).catch( reason => {
            res.status(FAILSTATUS).json({
                error: reason
        })
    })
}



const exit = (req: Request, res: Response, next: NextFunction) =>
{
    let userId:number = req.body.userId;
    service.exit(userId);
}



const logout = (req: Request, res: Response, next: NextFunction) =>
{
    let oldId: number = req.body.userId;
    let promise = service.logout(oldId);

    promise.then(
        userid =>
        {
            res.status(OKSTATUS).json({
                userId: userid
            })
        }
    ).catch(message =>
        res.status(FAILSTATUS).json({
            error: message

        }))
}


const getStoreInfo = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let storeId: number = req.body.storeId;
    let storeInfo: Promise<string> = service.getStoreInfo(userId, storeId);
    storeInfo.then(storeinfo => res.status(OKSTATUS).json(storeinfo)).catch(message => res.status(FAILSTATUS).json(message))
}


const getPruductInfoByName = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let productName: string = req.body.productName;
    service.getPruductInfoByName(userId, productName)
    .then(product => res.status(OKSTATUS).json(product))
    .catch(message => res.status(FAILSTATUS).json(message))
}

const getPruductInfoByCategory = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let productCategory: string = req.body.productCategory;
    service.getPruductInfoByCategory(userId, productCategory)
    .then(product => res.status(OKSTATUS).json(product))
    .catch(message => res.status(FAILSTATUS).json(message))
}

const addProductTocart = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let storeId: number = req.body.storeId;
    let productId: number = req.body.productId;
    let quantity: number = req.body.quantity;
    service.addProductTocart(userId, storeId, productId, quantity )
    .then(result => res.status(OKSTATUS).json(result))
    .catch(message => res.status(FAILSTATUS).json(message))
}


const getCartInfo = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    service.getCartInfo(userId)
    .then(cart => res.status(OKSTATUS).json(cart))
    .catch(message => res.status(FAILSTATUS).json(message))
}


const editCart = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let storeId: number = req.body.storeId;
    let productId: number = req.body.productId;
    let quantity: number = req.body.quantity;
    service.editCart(userId, storeId, productId, quantity )
    .then(result => res.status(OKSTATUS).json(result))
    .catch(message => res.status(FAILSTATUS).json(message))
}


const checkoutBasket = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let storeId: number = req.body.storeId;
    let supplyAddress: string = req.body.supplyAddress;
    service.checkoutBasket(userId, storeId, supplyAddress)
    .then(result => res.status(OKSTATUS).json(result))
    .catch(message => res.status(FAILSTATUS).json(message))
}


const checkoutSingleProduct = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let productId: number = req.body.productId;
    let quantity: number = req.body.quantity;
    let storeId: number = req.body.storeId;
    let supplyAddress: string = req.body.supplyAddress;
    service.checkoutSingleProduct(userId, productId, quantity, storeId, supplyAddress)
    .then(result => res.status(OKSTATUS).json(result))
    .catch(message => res.status(FAILSTATUS).json(message))
}


const completeOrder = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let storeId: number = req.body.storeId;
    let paymentInfoObj: any = req.body.paymentInfo;
    let paymentInfo: PaymentInfo = new PaymentInfo(paymentInfoObj.cardNumber, paymentInfoObj.expiration, paymentInfoObj.cvv);
    let userAddress: string = req.body.userAddress;
    service.completeOrder(userId, storeId, paymentInfo, userAddress)
    .then(result => res.status(OKSTATUS).json(result))
    .catch(message => res.status(FAILSTATUS).json(message))
}


//TODO: change the result so it wont sand back a store
const openStore = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let storeName: string = req.body.storeName;
    let bankAccountNumber: number = req.body.bankAccountNumber;
    let storeAddress: string = req.body.storeAddress;
    let promise = service.openStore(userId, storeName, bankAccountNumber, storeAddress);
    promise.then (store => {
        res.status(OKSTATUS).json({
            message: store.getStoreId()})})
    .catch( reason => {
        res.status(FAILSTATUS).json({
            error: reason
        })})
}


const editStoreInventory = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let storeId: number = req.body.storeId;
    let productId: number = req.body.productId;
    let quantity: number = req.body.quantity;
    service.editStoreInventory(userId, productId, quantity, storeId)
    .then(result => res.status(OKSTATUS).json(result))
    .catch(message => res.status(FAILSTATUS).json(message))
}

const addNewProduct = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let storeId: number = req.body.storeId;
    let productName: string = req.body.productName;
    let categories: string[] = req.body.categories;
    let quantity: number = req.body.quantity;
    let price: number = req.body.price;
    service.addNewProduct(userId, storeId, productName, categories, price, quantity)
    .then(result => res.status(OKSTATUS).json(result))
    .catch(message => res.status(FAILSTATUS).json(message))
}

const getSubscriberPurchaseHistory = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let subscriberToSeeId: number = req.body.subscriberToSeeId;
    service.getSubscriberPurchaseHistory(userId, subscriberToSeeId)
    .then(purchaseHistory => res.status(OKSTATUS).json(purchaseHistory))
    .catch(message => res.status(FAILSTATUS).json(message))
}


//TODO: change transaction to any 
const getStorePurchaseHistory = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let storeId: number = req.body.storeId;
    service.getStorePurchaseHistory(userId, storeId)
    .then(purchaseHistory => res.status(OKSTATUS).json(purchaseHistory))
    .catch(message => res.status(FAILSTATUS).json(message))
}


const deleteManagerFromStore = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let managerToDelete: number = req.body.managerToDelete;
    let storeId: number = req.body.storeId;
    service.deleteManagerFromStore(userId, managerToDelete, storeId)
    .then(result => res.status(OKSTATUS).json(result))
    .catch(message => res.status(FAILSTATUS).json(message))
}


const editStaffPermission = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let managerToEditId: number = req.body.managerToEditId;
    let storeId: number = req.body.storeId;
    let permissionMask: number = req.body.permissionMask;
    service.editStaffPermission(userId, storeId, managerToEditId, permissionMask)
    .then(productNumber => res.status(OKSTATUS).json(productNumber))
    .catch(message => res.status(FAILSTATUS).json(message))
}


const appointStoreOwner = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let storeId: number = req.body.storeId;
    let newOwnerId: number = req.body.newOwnerId;
    service.appointStoreOwner(userId, storeId, newOwnerId)
    .then(result => res.status(OKSTATUS).json(result))
    .catch(message => res.status(FAILSTATUS).json(message))
}


const appointStoreManager = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let storeId: number = req.body.storeId;
    let newManagerId: number = req.body.newManagerId;
    service.appointStoreManager(userId, storeId, newManagerId)
    .then(result => res.status(OKSTATUS).json(result))
    .catch(message => res.status(FAILSTATUS).json(message))
}


const getStoreStaff = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let storeId: number = req.body.storeId;
    let storestaff: Promise<string> = service.getStoreStaff(userId, storeId);
    storestaff.then(staff => res.status(OKSTATUS).json(staff)).
    catch(message => res.status(FAILSTATUS).json(message))
}


const getUsername = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;

    service.getUsername(userId)
    .then(username => res.status(OKSTATUS).json(username))
    .catch(message => res.status(FAILSTATUS).json(message))
}

const getWordList = (req: Request, res: Response, next: NextFunction) =>
{
    let word: string = req.body.word;
    let result: string[] = service.get_word_list(word);
    return res.status(OKSTATUS).json(
        {
            list: result
        }
    )
}

const addDiscountPolicy = (req: Request, res: Response, next: NextFunction) =>
{
    let discountPolicy: any = req.body;
    
    service.removeDiscountPolicy(discountPolicy); 
}

const addBuyingPolicy = (req: Request, res: Response, next: NextFunction) =>
{
    let buyingPolicy: any = req.body;
    
    service.addBuyingPolicy(buyingPolicy);  
}

const removeBuyingPolicy = (req: Request, res: Response, next: NextFunction) =>
{
    let discountNumber: number = req.body.policyId;

    service.removeBuyingPolicy(discountNumber); 
}


const removeDiscountPolicy = (req: Request, res: Response, next: NextFunction) =>
{
    let discountNumber: number = req.body.policyId;

    service.removeDiscountPolicy(discountNumber);
}






export default { 
    enter,
    register,
    login,
    exit,
    logout,
    getStoreInfo,
    getPruductInfoByName,
    getPruductInfoByCategory,
    addProductTocart,
    getCartInfo,
    editCart,
    checkoutBasket,
    checkoutSingleProduct,
    completeOrder,
    openStore,
    editStoreInventory,
    addNewProduct,
    getSubscriberPurchaseHistory,
    getStorePurchaseHistory,
    deleteManagerFromStore,
    editStaffPermission,
    appointStoreOwner,
    appointStoreManager,
    getStoreStaff,
    getWordList,
    addDiscountPolicy,
    addBuyingPolicy,
    removeBuyingPolicy,
    removeDiscountPolicy,
    getUsername
    };