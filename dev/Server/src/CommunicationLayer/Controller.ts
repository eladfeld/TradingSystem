import { Service } from '../ServiceLayer/Service';
import {Request, Response, NextFunction} from 'express';
import { isOk, Result } from '../Result';
import { Subscriber } from '../DomainLayer/user/Subscriber';
import PaymentInfo from '../DomainLayer/purchase/PaymentInfo';
import { Store } from '../DomainLayer/store/Store';
import Transaction from '../DomainLayer/purchase/Transaction';

const service: Service = Service.get_instance();
const OKSTATUS: number = 200;


const enter = (req: Request, res: Response, next: NextFunction) =>
{
    console.log('command recived');
    let userId: Result<number> = service.enter();
    if(isOk(userId))
        return res.status(OKSTATUS).json({
            userId: userId.value
        })
    return res.status(OKSTATUS).json({
       error: userId.message
    })
}

const register = (req: Request, res: Response, next: NextFunction) =>
{
    let username: string = req.body.username;
    let password: string = req.body.password;
    let userId: Result<string> = service.register(username, password);
    if(isOk(userId))
        return res.status(OKSTATUS).json({
            message: userId.value
        })
    return res.status(OKSTATUS).json({
       error: userId.message 
    })
}



//TODO: change the result so it wont sand back a subscriber
const login = (req: Request, res: Response, next: NextFunction) =>
{
    let oldId: number = req.body.userId;
    let username: string = req.body.username;
    let password: string = req.body.password;
    let user: Result<Subscriber> = service.login(oldId, username, password);
    let userId = isOk(user) ? user.value : undefined;
    console.log(service.get_logged_subscribers());
    if(isOk(user))
        return res.status(OKSTATUS).json({
            userId: user.value.getUserId()
        })
    return res.status(OKSTATUS).json({
       error: 'could not enter' 
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
    let userId: Result<number> = service.logout(oldId);
    if(isOk(userId))
        return res.status(OKSTATUS).json({
            userId: userId.value
        })
    return res.status(OKSTATUS).json({
       error: userId.message
    })
}


const getStoreInfo = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let storeId: number = req.body.storeId;
    let storeInfo: Result<string> = service.getStoreInfo(userId, storeId);
    if(isOk(storeInfo))
        return res.status(OKSTATUS).json({
            userId: storeInfo.value
        })
    return res.status(OKSTATUS).json({
       error: storeInfo.message
    })
}


const getPruductInfoByName = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let productName: string = req.body.productName;
    let product: Result<string> = service.getPruductInfoByName(userId, productName);
    if(isOk(product))
        return res.status(OKSTATUS).json(JSON.parse(product.value))
    return res.status(OKSTATUS).json({
       error: product.message
    })
}

const getPruductInfoByCategory = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let productCategory: number = req.body.productCategory;
    let product: Result<string> = service.getPruductInfoByCategory(userId, productCategory);
    if(isOk(product))
        return res.status(OKSTATUS).json(JSON.parse(product.value))
    return res.status(OKSTATUS).json({
       error: product.message
    })
}

const addProductTocart = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let storeId: number = req.body.storeId;
    let productId: number = req.body.productId;
    let quantity: number = req.body.quantity;
    let result: Result<string> = service.addProductTocart(userId, storeId, productId, quantity );
    if(isOk(result))
        return res.status(OKSTATUS).json({
            message: result.value
        })
    return res.status(OKSTATUS).json({
       error: result.message
    })
}


const getCartInfo = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let cart: Result<string> = service.getCartInfo(userId);
    if(isOk(cart))
        return res.status(OKSTATUS).json(JSON.parse(cart.value))
    return res.status(OKSTATUS).json({
       error: cart.message
    })
}


const editCart = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let storeId: number = req.body.storeId;
    let productId: number = req.body.productId;
    let quantity: number = req.body.quantity;
    let result: Result<string> = service.editCart(userId, storeId, productId, quantity );
    if(isOk(result))
        return res.status(OKSTATUS).json({
            message: result.value
        })
    return res.status(OKSTATUS).json({
       error: result.message
    })
}


const checkoutBasket = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let storeId: number = req.body.storeId;
    let supplyAddress: string = req.body.supplyAddress;
    let result: Result<boolean> = service.checkoutBasket(userId, storeId, supplyAddress );
    if(isOk(result))
        return res.status(OKSTATUS).json({
            message: result.value
        })
    return res.status(OKSTATUS).json({
       error: result.message
    })
}


const checkoutSingleProduct = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let productId: number = req.body.productId;
    let quantity: number = req.body.quantity;
    let storeId: number = req.body.storeId;
    let supplyAddress: string = req.body.supplyAddress;
    let result: Result<string> = service.checkoutSingleProduct(userId, productId, quantity, storeId, supplyAddress);
    if(isOk(result))
        return res.status(OKSTATUS).json({
            message: result.value
        })
    return res.status(OKSTATUS).json({
       error: result.message
    })
}


const completeOrder = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let storeId: number = req.body.storeId;
    let paymentInfo: PaymentInfo = req.body.paymentInfo;
    let result: Result<boolean> = service.completeOrder(userId, storeId, paymentInfo);
    if(isOk(result))
        return res.status(OKSTATUS).json({
            message: result.value
        })
    return res.status(OKSTATUS).json({
       error: result.message
    })
}


//TODO: change the result so it wont sand back a store
const openStore = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let storeName: string = req.body.storeName;
    let bankAccountNumber: number = req.body.bankAccountNumber;
    let storeAddress: string = req.body.storeAddress;
    let result: Result<Store> = service.openStore(userId, storeName, bankAccountNumber, storeAddress);
    if(isOk(result))
        return res.status(OKSTATUS).json({
            message: result.value
        })
    return res.status(OKSTATUS).json({
       error: result.message
    })
}


const editStoreInventory = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let storeId: number = req.body.storeId;
    let productId: number = req.body.productId;
    let quantity: number = req.body.quantity;
    let result: Result<string> = service.editStoreInventory(userId, productId, quantity, storeId);
    if(isOk(result))
        return res.status(OKSTATUS).json({
            message: result.value
        })
    return res.status(OKSTATUS).json({
       error: result.message
    })
}

const addNewProduct = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let storeId: number = req.body.storeId;
    let productName: string = req.body.productName;
    let categories: number[] = req.body.categories;
    let quantity: number = req.body.quantity;
    let price: number = req.body.price;
    let result: Result<number> = service.addNewProduct(userId, storeId, productName, categories, price, quantity);
    if(isOk(result))
        return res.status(OKSTATUS).json({
            productNumber: result.value
        })
    return res.status(OKSTATUS).json({
       error: result.message
    })
}

const getSubscriberPurchaseHistory = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let subscriberToSeeId: number = req.body.subscriberToSeeId;
    let result: Result<any> = service.getSubscriberPurchaseHistory(userId, subscriberToSeeId);
    if(isOk(result))
        return res.status(OKSTATUS).json({
            productNumber: result.value
        })
    return res.status(OKSTATUS).json({
       error: result.message
    })
}


//TODO: change transaction to any 
const getStorePurchaseHistory = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let storeId: number = req.body.storeId;
    let result: Result<Transaction[]> = service.getStorePurchaseHistory(userId, storeId);
    if(isOk(result))
        return res.status(OKSTATUS).json({
            productNumber: result.value
        })
    return res.status(OKSTATUS).json({
       error: result.message
    })
}


const deleteManagerFromStore = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let managerToDelete: number = req.body.managerToDelete;
    let storeId: number = req.body.storeId;
    let result: Result<string> = service.deleteManagerFromStore(userId, managerToDelete, storeId);
    if(isOk(result))
        return res.status(OKSTATUS).json({
            productNumber: result.value
        })
    return res.status(OKSTATUS).json({
       error: result.message
    })
}


const editStaffPermission = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let managerToEditId: number = req.body.managerToEditId;
    let storeId: number = req.body.storeId;
    let permissionMask: number = req.body.permissionMask;

    let result: Result<string> = service.editStaffPermission(userId, storeId, managerToEditId, permissionMask);
    if(isOk(result))
        return res.status(OKSTATUS).json({
            productNumber: result.value
        })
    return res.status(OKSTATUS).json({
       error: result.message
    })
}


const appointStoreOwner = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let storeId: number = req.body.storeId;
    let newOwnerId: number = req.body.newOwnerId;
    let result: Result<string> = service.appointStoreOwner(userId, storeId, newOwnerId);
    if(isOk(result))
        return res.status(OKSTATUS).json({
            productNumber: result.value
        })
    return res.status(OKSTATUS).json({
       error: result.message
    })
}


const appointStoreManager = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let storeId: number = req.body.storeId;
    let newManagerId: number = req.body.newManagerId;
    let result: Result<string> = service.appointStoreManager(userId, storeId, newManagerId);
    if(isOk(result))
        return res.status(OKSTATUS).json({
            productNumber: result.value
        })
    return res.status(OKSTATUS).json({
       error: result.message
    })
}


const getStoreStaff = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let storeId: number = req.body.storeId;
    let result: Result<string> = service.getStoreStaff(userId, storeId);
    if(isOk(result))
        return res.status(OKSTATUS).json({
            productNumber: result.value
        })
    return res.status(OKSTATUS).json({
       error: result.message
    })
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
    getWordList
    };