import { Service } from '../ServiceLayer/Service';
import {Request, Response, NextFunction} from 'express';
import { Subscriber } from '../DomainLayer/user/Subscriber';
import { SpellCheckerAdapter } from '../DomainLayer/SpellCheckerAdapter';
import { tPredicate } from '../DomainLayer/discount/logic/Predicate';
import { tDiscount } from '../DomainLayer/discount/Discount';
import { promises } from 'dns';

let service: Service = undefined;
const OKSTATUS: number = 200;
const FAILSTATUS: number = 201;


const initSystem = async () =>
{
    service = await Service.get_instance();
}


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
    let productCategory: string = req.body.category;
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
    let shippingInfo: any = req.body.supplyAddress;
    let checkout_res = service.checkoutBasket(sessionId, storeId, shippingInfo)
    checkout_res.then(result => res.status(OKSTATUS).json(result))
    .catch( message =>res.status(FAILSTATUS).json(message))
}


const checkoutSingleProduct = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId: string = req.body.userId;
    let productId: number = req.body.productId;
    let quantity: number = req.body.quantity;
    let storeId: number = req.body.storeId;
    let shippingInfo: any = req.body.supplyAddress;
    service.checkoutSingleProduct(sessionId, productId, quantity, storeId, shippingInfo)
    .then(result => res.status(OKSTATUS).json(result))
    .catch(message => res.status(FAILSTATUS).json(message))
}


const completeOrder = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId: string = req.body.userId;
    let storeId: number = req.body.storeId;
    let paymentInfo: any = req.body.paymentInfo;
    let shippingInfo: any = req.body.shippingInfo;
    service.completeOrder(sessionId, storeId, paymentInfo, shippingInfo)
    .then(result => res.status(OKSTATUS).json(result))
    .catch(message => {console.log(message); res.status(FAILSTATUS).json(message)})
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
    service.editStoreInventory(sessionId, storeId, productId, quantity)
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
    let image: string = req.body.image;
    service.addNewProduct(sessionId, storeId, productName, categories, price, quantity, image)
    .then(result => res.status(OKSTATUS).json(result))
    .catch(message => res.status(FAILSTATUS).json({error:message}))
}

const addCategory = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId: string = req.body.userId;
    let storeId: number = req.body.storeId;
    let categoryFather: string = req.body.categoryFather;
    let category: string = req.body.category;
    service.addCategory(sessionId, storeId, categoryFather, category)
    .then(result => res.status(OKSTATUS).json(result))
    .catch(message => res.status(FAILSTATUS).json({error:message}))
}

const addCategoryToRoot = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId: string = req.body.userId;
    let storeId: number = req.body.storeId;
    let category: string = req.body.category;
    service.addCategoryToRoot(sessionId, storeId, category)
    .then(result => res.status(OKSTATUS).json(result))
    .catch(message => res.status(FAILSTATUS).json({error:message}))
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
    let managerToRemove: string = req.body.managerToRemove;
    let storeId: number = req.body.storeId;
    service.deleteManagerFromStore(sessionId, managerToRemove, storeId)
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
    let sessionId   : string = req.body.userId;
    let storeId     : number = req.body.storeId;
    let discountName: string = req.body.discountName;
    let discount    : tDiscount = req.body.discount;
    let promise = service.addDiscountPolicy(sessionId, storeId, discountName, discount);
    promise
    .then(message => res.status(OKSTATUS).json(message))
    .catch(message => res.status(FAILSTATUS).json(message));
}

const addBuyingPolicy = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId   : string = req.body.userId;
    let storeId     : number = req.body.storeId;
    let policyName  : string = req.body.policyName;
    let policy: tPredicate = req.body.policy;
    let promise = service.addBuyingPolicy(sessionId, storeId, policyName, policy);
    promise
    .then(message => res.status(OKSTATUS).json(message))
    .catch(message => res.status(FAILSTATUS).json(message));
}

const removeBuyingPolicy = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId   : string = req.body.userId;
    let storeId     : number = req.body.storeId;
    let policyNumber: number = req.body.policyId;
    let promise = service.removeBuyingPolicy(sessionId, storeId, policyNumber );
    promise
    .then(message => res.status(OKSTATUS).json(message))
    .catch(message => res.status(FAILSTATUS).json(message));
}

// const getBuyingPolicies = (req: Request, res: Response, next: NextFunction) =>
// {
//     let sessionId   : string = req.body.userId;
//     let storeId     : number = req.body.storeId;
//     let promise = service.getBuyingPolicies(sessionId, storeId);
//     promise
//     .then(message => res.status(OKSTATUS).json(message))
//     .catch(message => res.status(FAILSTATUS).json(message));
// }

const removeDiscountPolicy = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId   : string = req.body.userId;
    let storeId     : number = req.body.storeId;
    let policyNumber: number = req.body.policyId;
    let promise = service.removeDiscountPolicy(sessionId, storeId, policyNumber );
    promise
    .then(message => res.status(OKSTATUS).json(message))
    .catch(message => res.status(FAILSTATUS).json(message));
}


const getSubscriberId = (sessionId: string): number =>
{
    return service.getSubscriberId(sessionId);
}

// this function is to give the clients autocomplete data with catagories
const getAllCategories = (req : Request, res: Response , next: NextFunction) =>
{
    let catagories = JSON.stringify(SpellCheckerAdapter.get_instance().get_all_categories());
    res.status(OKSTATUS).json(catagories);
}

// this function is to give the clients autocomplete data with products
const getProductNames = (req : Request, res: Response , next: NextFunction) =>
{
    let products = JSON.stringify(SpellCheckerAdapter.get_instance().get_all_product_names());
    res.status(OKSTATUS).json(products);
}

// this function is to give the clients autocomplete data with keywords
const getkeywords = (req : Request, res: Response , next: NextFunction) =>
{
    let keywords = JSON.stringify(SpellCheckerAdapter.get_instance().get_all_keywords());
    res.status(OKSTATUS).json(keywords);
}

// this function is to give the clients autocomplete data with stores
const getStoreNames = (req : Request, res: Response , next: NextFunction) =>
{
    let stores = JSON.stringify(SpellCheckerAdapter.get_instance().get_all_store_names());
    res.status(OKSTATUS).json(stores);
}



//Need to support! here broooo
const complain = (req : Request, res: Response , next: NextFunction) =>{
    let sessionId   : string = req.body.userId;
    let message     : {title:string, body:string, authorName:string} = req.body.message;
    let promise = service.complain(sessionId, message.title, message.body);
    promise
    .then(msg => res.status(OKSTATUS).json(msg))
    .catch(msg => res.status(FAILSTATUS).json(msg));
}
const getUserNames = (req : Request, res: Response , next: NextFunction) =>{
    let sessionId   : string = req.body.userId;
    let promise = service.getUsernames(sessionId);
    promise
    .then(message => res.status(OKSTATUS).json(message))
    .catch(message => res.status(FAILSTATUS).json(message));
}
const getSystemComplaints = (req : Request, res: Response , next: NextFunction) =>{
    let sessionId   : string = req.body.userId;
    let promise = service.getSystemComplaints(sessionId);
    promise
    .then(message => res.status(OKSTATUS).json(message))
    .catch(message => res.status(FAILSTATUS).json(message));

}
const getSystemTransactions = (req : Request, res: Response , next: NextFunction) =>{
    let sessionId   : string = req.body.userId;

}
const closeStore = (req : Request, res: Response , next: NextFunction) =>{
    let sessionId   : string = req.body.userId;
    let storeName   : string = req.body.storeName;
    let promise = service.closeStore(sessionId, storeName);
    promise
    .then(message => res.status(OKSTATUS).json(message))
    .catch(message => res.status(FAILSTATUS).json(message));
}
const deleteComplaint = (req : Request, res: Response , next: NextFunction) =>{
    let sessionId   : string = req.body.userId;
    let messageId   : number = req.body.messageId;
    let promise = service.deleteComplaint(sessionId, messageId);
    promise
    .then(message => res.status(OKSTATUS).json(message))
    .catch(message => res.status(FAILSTATUS).json(message));
}
const replyToComplaint = (req : Request, res: Response , next: NextFunction) =>{
    let sessionId   : string = req.body.userId;
    let replyMsg    : {title:string, body:string, id:number} = req.body.message;//id of message being replied to
    let promise = service.replyToComplaint(sessionId, replyMsg.title, replyMsg.body, replyMsg.id);
    promise
    .then(message => res.status(OKSTATUS).json(message))
    .catch(message => res.status(FAILSTATUS).json(message));
}

const getLoginStats = (req : Request, res: Response , next: NextFunction) =>{
    console.log(req.body)
    console.log(req)
    let sessionId : string = req.body.sessionId
    let from : Date = new Date(req.body.from)
    let until : Date = new Date(req.body.until)
    console.log(from)
    console.log(until)
    let getstatsp = service.getLoginStats(sessionId , from, until)
    getstatsp.then(message => res.status(OKSTATUS).json(message))
    .catch(error => res.status(FAILSTATUS).json(error));

}

const OfferResponseByOwner = (req : Request, res: Response , next: NextFunction) =>
{
    let sessionId : string = req.body.sessionId
    let response : boolean = req.body.response
    let storeId: number = req.body.storeId
    let offerId: number= req.body.offerId
    service.OfferResponseByOwner(sessionId, response, storeId, offerId)
    .then(message => res.status(OKSTATUS).json(message))
    .catch(error => res.status(FAILSTATUS).json(error))
}

const getOffersByStore = (req : Request, res: Response , next: NextFunction) =>
{
    let storeId: number = req.body.storeId
    service.getOffersByStore(storeId)
    .then(message => res.status(OKSTATUS).json(message))
    .catch(error => res.status(FAILSTATUS).json(error))
}

const newOffer = (req : Request, res: Response , next: NextFunction) =>
{
    let sessionId : string = req.body.userId
    let storeId: number = req.body.storeId
    let productId: number = req.body.productId
    let bid: number = req.body.bid
    service.newOffer(sessionId, storeId, productId, bid)
    .then(message => res.status(OKSTATUS).json(message))
    .catch(error => res.status(FAILSTATUS).json(error))
}

const setRecievingOffers = (req: Request, res: Response, next: NextFunction) =>
{
    let state: boolean = req.body.state;
    let storeId: number = req.body.storeId;
    if(state)service.setStoreToRecieveOffers(storeId)
    .then(message => res.status(OKSTATUS).json(message))
    .catch(error => res.status(FAILSTATUS).json(error))
    else
    {
        service.setStoreToNotRecieveOffers(storeId)
        .then(message => res.status(OKSTATUS).json(message))
        .catch(error => res.status(FAILSTATUS).json(error))
    }
}

const isRecievingOffers = (req: Request, res: Response, next: NextFunction) =>
{
    let storeId: number = req.body.storeId
    service.isRecievingOffers(storeId)
    .then(message => res.status(OKSTATUS).json(message))
    .catch(error => res.status(FAILSTATUS).json(error))
}

const acceptOffer = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId = req.body.userId;
    let storeId = req.body.storeId;
    let offerId = req.body.offerId;

    service.acceptOffer(sessionId, storeId, offerId)
    .then(message => res.status(OKSTATUS).json(message))
    .catch(error => res.status(FAILSTATUS).json(error))
}

const declineOffer = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId = req.body.userId;
    let storeId = req.body.storeId;
    let offerId = req.body.offerId;

    service.declineOffer(sessionId, storeId, offerId)
    .then(message => res.status(OKSTATUS).json(message))
    .catch(error => res.status(FAILSTATUS).json(error))
}

const counterOffer = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId = req.body.userId;
    let storeId = req.body.storeId;
    let offerId = req.body.offerId;
    let counterOffer = req.body.counterOffer;

    service.counterOffer(sessionId, storeId, offerId, counterOffer)
    .then(message => res.status(OKSTATUS).json(message))
    .catch(error => res.status(FAILSTATUS).json(error))
}

const buyAcceptedOffer = (req: Request, res: Response, next: NextFunction) =>
{
    let sessionId = req.body.userId;
    let storeId = req.body.storeId;
    let offerId = req.body.offerId;

    service.buyAcceptedOffer(sessionId, storeId, offerId)
    .then(message => res.status(OKSTATUS).json(message))
    .catch(error => res.status(FAILSTATUS).json(error))
}


const getOffersByUser = (req: Request, res: Response, next: NextFunction) => {
    let sessionId = req.body.userId;

    service.getOffersByUser(sessionId)
    .then(message => res.status(OKSTATUS).json(message))
    .catch(error => res.status(FAILSTATUS).json(error))
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
    addCategory,
    addCategoryToRoot,
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
    // getBuyingPolicies,
    removeDiscountPolicy,
    getUsername,
    getUserStores,
    getMyPurchaseHistory,
    getSubscriberId,
    getAllCategories,
    getProductNames,
    getkeywords,
    getStoreNames,
    complain,
    getUserNames,
    getSystemComplaints,
    getSystemTransactions,
    closeStore,
    deleteComplaint,
    replyToComplaint,
    initSystem,
    getLoginStats,
    OfferResponseByOwner,
    getOffersByStore,
    newOffer,
    setRecievingOffers,
    isRecievingOffers,
    acceptOffer,
    declineOffer,
    counterOffer,
    buyAcceptedOffer,
    getOffersByUser,
    };