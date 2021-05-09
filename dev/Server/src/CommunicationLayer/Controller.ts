import { Service } from '../ServiceLayer/Service';
import {Request, Response, NextFunction} from 'express';
import { isOk, Result } from '../Result';
import { Subscriber } from '../DomainLayer/user/Subscriber';
import PaymentInfo from '../DomainLayer/purchase/PaymentInfo';
import { checkout } from './Router';

const service: Service = Service.get_instance();
const OKSTATUS: number = 200;
const FAILSTATUS: number = 201;


const enter = (req: Request, res: Response, next: NextFunction) =>
{
    let promise: Promise<string> = service.enter();
    promise.then( userId => {
        return res.status(OKSTATUS).json({
            userId: userId});
        }).catch( message => {
        return res.status(FAILSTATUS).json({
            error: message
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
    let sessionId: string = req.body.userId;
    let username: string = req.body.username;
    let password: string = req.body.password;
    let promise: Promise<Subscriber> = service.login(sessionId, username, password);
    promise.then ( subscriber => {
        res.status(OKSTATUS).json({
            userId: sessionId,
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
    let sessionId:string = req.body.userId;
    service.exit(sessionId);
}



const logout = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId: string = req.body.userId;
    let promise = service.logout(sessionId);

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
    let sessionId: string = req.body.userId;
    let storeId: number = req.body.storeId;
    let storeInfo: Promise<string> = service.getStoreInfo(sessionId, storeId);
    storeInfo.then(storeinfo => res.status(OKSTATUS).json(storeinfo)).catch(message => res.status(FAILSTATUS).json(message))
}


const getPruductInfoByName = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId: string = req.body.userId;
    let productName: string = req.body.productName;
    service.getPruductInfoByName(sessionId, productName)
    .then(product => res.status(OKSTATUS).json(product))
    .catch(message => res.status(FAILSTATUS).json(message))
}

const getPruductInfoByCategory = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId: string = req.body.userId;
    let productCategory: string = req.body.productCategory;
    service.getPruductInfoByCategory(sessionId, productCategory)
    .then(product => res.status(OKSTATUS).json(product))
    .catch(message => res.status(FAILSTATUS).json(message))
}

const getPruductInfoAbovePrice= (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let price: number = req.body.price;
    service.getPruductInfoAbovePrice(userId, price)
    .then(product => res.status(OKSTATUS).json(product))
    .catch(message => res.status(FAILSTATUS).json(message))
}

const getPruductInfoBelowPrice = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let price: number = req.body.price;
    service.getPruductInfoBelowPrice(userId, price)
    .then(product => res.status(OKSTATUS).json(product))
    .catch(message => res.status(FAILSTATUS).json(message))
}

const getPruductInfoByStore = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let store: string = req.body.store;
    service.getPruductInfoByStore(userId, store)
    .then(product => res.status(OKSTATUS).json(product))
    .catch(message => res.status(FAILSTATUS).json(message))
}

const addProductTocart = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId: string = req.body.userId;
    let storeId: number = req.body.storeId;
    let productId: number = req.body.productId;
    let quantity: number = req.body.quantity;
    service.addProductTocart(sessionId, storeId, productId, quantity )
    .then(result => res.status(OKSTATUS).json(result))
    .catch(message => res.status(FAILSTATUS).json(message))
}


const getCartInfo = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId: string = req.body.userId;
    service.getCartInfo(sessionId)
    .then(cart => res.status(OKSTATUS).json(cart))
    .catch(message => res.status(FAILSTATUS).json(message))
}


const editCart = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId: string = req.body.userId;
    let storeId: number = req.body.storeId;
    let productId: number = req.body.productId;
    let quantity: number = req.body.quantity;

    service.editCart(sessionId, storeId, productId, quantity )
    .then(result => res.status(OKSTATUS).json(result))
    .catch(message => res.status(FAILSTATUS).json(message))
}


const checkoutBasket = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId: string = req.body.userId;
    let storeId: number = req.body.storeId;
    let supplyAddress: string = req.body.supplyAddress;
    let checkout_res = service.checkoutBasket(sessionId, storeId, supplyAddress)
    checkout_res.then(result => res.status(OKSTATUS).json(result))
    .catch( message =>res.status(FAILSTATUS).json(message))
}


const checkoutSingleProduct = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId: string = req.body.userId;
    let productId: number = req.body.productId;
    let quantity: number = req.body.quantity;
    let storeId: number = req.body.storeId;
    let supplyAddress: string = req.body.supplyAddress;
    service.checkoutSingleProduct(sessionId, productId, quantity, storeId, supplyAddress)
    .then(result => res.status(OKSTATUS).json(result))
    .catch(message => res.status(FAILSTATUS).json(message))
}


const completeOrder = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId: string = req.body.userId;
    let storeId: number = req.body.storeId;
    let paymentInfoObj: any = req.body.paymentInfo;
    let paymentInfo: PaymentInfo = new PaymentInfo(paymentInfoObj.cardNumber, paymentInfoObj.expiration, paymentInfoObj.cvv);
    let userAddress: string = req.body.userAddress;
    service.completeOrder(sessionId, storeId, paymentInfo, userAddress)
    .then(result => res.status(OKSTATUS).json(result))
    .catch(message => res.status(FAILSTATUS).json(message))
}


//TODO: change the result so it wont sand back a store
const openStore = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId: string = req.body.userId;
    let storeName: string = req.body.storeName;
    let bankAccountNumber: number = req.body.bankAccountNumber;
    let storeAddress: string = req.body.storeAddress;
    let promise = service.openStore(sessionId, storeName, bankAccountNumber, storeAddress);
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
    let sessionId: string = req.body.userId;
    let storeId: number = req.body.storeId;
    let productId: number = req.body.productId;
    let quantity: number = req.body.quantity;
    service.editStoreInventory(sessionId, productId, quantity, storeId)
    .then(result => res.status(OKSTATUS).json(result))
    .catch(message => res.status(FAILSTATUS).json(message))
}

const addNewProduct = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId: string = req.body.userId;
    let storeId: number = req.body.storeId;
    let productName: string = req.body.productName;
    let categories: string[] = req.body.categories;
    let quantity: number = req.body.quantity;
    let price: number = req.body.price;
    service.addNewProduct(sessionId, storeId, productName, categories, price, quantity)
    .then(result => res.status(OKSTATUS).json(result))
    .catch(message => res.status(FAILSTATUS).json(message))
}

const getSubscriberPurchaseHistory = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId: string = req.body.userId;
    let subscriberToSeeId: number = req.body.subscriberToSeeId;
    service.getSubscriberPurchaseHistory(sessionId, subscriberToSeeId)
    .then(purchaseHistory => res.status(OKSTATUS).json(purchaseHistory))
    .catch(message => res.status(FAILSTATUS).json(message))
}

const getMyPurchaseHistory = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId: string = req.body.userId;
    service.getMyPurchaseHistory(sessionId)
    .then(purchaseHistory => res.status(OKSTATUS).json(purchaseHistory))
    .catch(message => res.status(FAILSTATUS).json(message))
}


//TODO: change transaction to any
const getStorePurchaseHistory = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId: string = req.body.userId;
    let storeId: number = req.body.storeId;
    service.getStorePurchaseHistory(sessionId, storeId)
    .then(purchaseHistory => res.status(OKSTATUS).json(purchaseHistory))
    .catch(message => res.status(FAILSTATUS).json(message))
}


const deleteManagerFromStore = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId: string = req.body.userId;
    let managerToDelete: number = req.body.managerToDelete;
    let storeId: number = req.body.storeId;
    service.deleteManagerFromStore(sessionId, managerToDelete, storeId)
    .then(result => res.status(OKSTATUS).json(result))
    .catch(message => res.status(FAILSTATUS).json(message))
}


const editStaffPermission = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId: string = req.body.userId;
    let managerToEditId: number = req.body.managerToEditId;
    let storeId: number = req.body.storeId;
    let permissionMask: number = req.body.permissionMask;
    service.editStaffPermission(sessionId, managerToEditId, storeId, permissionMask)
    .then(productNumber => res.status(OKSTATUS).json(productNumber))
    .catch(message => res.status(FAILSTATUS).json(message)) 
}


const appointStoreOwner = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId: string = req.body.userId;
    let storeId: number = req.body.storeId;
    let newOwnerUsername: string = req.body.newOwnerUsername;
    service.appointStoreOwner(sessionId, storeId, newOwnerUsername)
    .then(result => res.status(OKSTATUS).json(result))
    .catch(message => res.status(FAILSTATUS).json(message))
}


const appointStoreManager = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId: string = req.body.userId;
    let storeId: number = req.body.storeId;
    let newManagerUsername: string = req.body.newManagerUsername;
    service.appointStoreManager(sessionId, storeId, newManagerUsername)
    .then(result => res.status(OKSTATUS).json(result))
    .catch(message => res.status(FAILSTATUS).json(message))
}


const getStoreStaff = (req: Request, res: Response, next: NextFunction) =>
{
    let user_sessionId: string = req.body.userId;
    let storeId: number = req.body.storeId;
    let storestaff: Promise<string> = service.getStoreStaff(user_sessionId, storeId);
    storestaff.then(staff => res.status(OKSTATUS).json(staff)).
    catch(message => res.status(FAILSTATUS).json(message))
}


const getUsername = (req: Request, res: Response, next: NextFunction) =>
{
    let user_sessionId: string = req.body.userId;

    service.getUsername(user_sessionId)
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

const getUserStores = (req: Request , res:Response , next : NextFunction) =>
{
    let sessionId :string = req.body.userId;
    let promise = service.getUserStores(sessionId);
    promise
    .then( stores => res.status(OKSTATUS).json(stores))
    .catch(message => res.status(FAILSTATUS).json(message))
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


getUserStores
const getSubscriberId = (sessionId: string): number =>
{
    return service.getSubscriberId(sessionId);
}


const setServFunc = (func: (userId:number, message:string) => Promise<string>) =>
{
    service.set_send_func(func);
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
    getPruductInfoAbovePrice,
    getPruductInfoBelowPrice,
    getPruductInfoByStore,
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
    getUsername,
    getUserStores,
    getMyPurchaseHistory,
    getSubscriberId,
    setServFunc,
    };