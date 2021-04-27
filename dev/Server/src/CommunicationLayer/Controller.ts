import { Service } from '../ServiceLayer/Service';
import {Request, Response, NextFunction} from 'express';
import { isOk, Result } from '../Result';
import { Subscriber } from '../DomainLayer/user/Subscriber';

const service: Service = Service.get_instance();

const enter = (req: Request, res: Response, next: NextFunction) =>
{
    console.log('command recived');
    let userId: Result<number> = service.enter();
    if(isOk(userId))
        return res.status(200).json({
            userId: userId.value
        })
    return res.status(200).json({
       error: userId.message
    })
}

const register = (req: Request, res: Response, next: NextFunction) =>
{
    let username: string = req.body.username;
    let password: string = req.body.password;
    let userId: Result<string> = service.register(username, password);
    if(isOk(userId))
        return res.status(200).json({
            message: userId.value
        })
    return res.status(200).json({
       error: userId.message 
    })
}


const login = (req: Request, res: Response, next: NextFunction) =>
{
    let oldId: number = req.body.userId;
    let username: string = req.body.username;
    let password: string = req.body.password;
    let user: Result<Subscriber> = service.login(oldId, username, password);
    let userId = isOk(user) ? user.value : undefined;
    console.log(service.get_logged_subscribers());
    if(isOk(user))
        return res.status(200).json({
            userId: user.value.getUserId()
        })
    return res.status(200).json({
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
        return res.status(200).json({
            userId: userId.value
        })
    return res.status(200).json({
       error: userId.message
    })
}


const getStoreInfo = (req: Request, res: Response, next: NextFunction) =>
{
    let userId: number = req.body.userId;
    let storeId: number = req.body.storeId;
    let storeInfo: Result<string> = service.getStoreInfo(userId, storeId);
    if(isOk(storeInfo))
        return res.status(200).json({
            userId: storeInfo.value
        })
    return res.status(200).json({
       error: storeInfo.message
    })
}


const getPruductInfoByName = (req: Request, res: Response, next: NextFunction) =>
{
    // let userId: number = req.body.userId;
    // let productName: string = req.body.productName;
    // let product: Result<> = service.enter();
    // if(isOk(userId))
    //     return res.status(200).json({
    //         userId: userId.value
    //     })
    // return res.status(200).json({
    //    error: userId.message
    // })
}



export default { 
    enter,
    register,
    login,
    exit,
    logout,
    getStoreInfo

    
    };