import { StoreProduct } from "./StoreProduct";
import { Logger } from "../../Logger";
import { isFailure, isOk, makeFailure, makeOk, Result } from "../../Result";
import { StoreProductInfo } from "./StoreInfo";
import { productDB } from "../../DataAccessLayer/DBinit";

export class Inventory
{

    private storeId: number

    public constructor(storeId: number){
        this.storeId = storeId;
    }

    public addNewProduct(productName: string, categories: string[], storeId: number, price: number, quantity = 0) : Promise<number> {
        if (quantity < 0){
            Logger.log("Quantity must be non negative")
            return Promise.reject("Quantity must be non negative");
        }

        if (price < 0){
            Logger.log("Price must be non negative")
            return Promise.reject("Price must be non negative");
        }

        let productp = productDB.getProductByName(productName)
        return new Promise((resolve,reject) => {
            productp.then( product => {
                Logger.log(`Product already exist in inventory! productName: ${productName}`);
                reject('Product already exist in inventory!');
            })
            .catch( _ => {
                let storeProductp = StoreProduct.createProduct(productName,price, storeId,quantity, categories);
                storeProductp.then(storeProduct =>
                    {
                        resolve(storeProduct.getProductId());
                    })
                    .catch(error => reject(error));
            })
        })
    }

    public addProductQuantity(productId: number, quantity: number) : Promise<string> {
        let productp = productDB.getProductById(productId);
        return new Promise((resolve,reject) => {
            productp.then( product => {
                product.addQuantity(quantity);
                productDB.updateProduct(product)
                return resolve("Quantity was added");
            })
            .catch( _ => {
                Logger.log("Product does not exist in inventory!")
                reject("Product does not exist in inventory!");
            })
        })
    }

    public setProductQuantity(productId: number, quantity: number) : Promise<string> {
        let productp = productDB.getProductById(productId);
        return new Promise((resolve,reject) => {
            productp.then( product => {
                product.setQuantity(quantity);
                productDB.updateProduct(product)
                return Promise.resolve("Quantity was set");
                
            })
            .catch( _ => {
                Logger.log("Product does not exist in inventory!")
                return Promise.reject("Product does not exist in inventory!");
            })
        })
    }

    public isProductAvailable(productId: number, quantity: number) : Promise<boolean> {
        let productp = productDB.getProductById(productId);
        return new Promise((resolve,reject) => {
            productp.then( product => {
                if(product.getQuantity() >= quantity){
                    resolve(true)
                }
                resolve(false)
            }).catch( err => {
                Logger.log("Product does not exist in inventory!")
                reject(false);
            })

        })
    }

    public hasProductWithName(productName: string) : Promise<true> {
        let productp = productDB.getProductByName(productName);
        return new Promise((resolve,reject) => {
            productp.then( product => {
                    resolve(true)
            }).catch( err => {
                Logger.log("Doesn't have product with name")
                reject(false);
            })

        })
    }

    public reserveProduct(productId: number, quantity: number): Promise<boolean> {
        let isAvailablep = this.isProductAvailable(productId, quantity)
        return new Promise((resolve,reject) => {
            isAvailablep.then( isAvailable => {
                if(isAvailable){
                    let productp = productDB.getProductById(productId);
                    productp.then(product => {
                    product.setQuantity(product.getQuantity() - quantity);
                    resolve(true)
                    }).catch(err => reject(err))
                } else {
                    Logger.log("Product is not available")
                    reject(false);
                }
            }).catch( err => {
                Logger.log("Doesn't have product with name")
                reject(false);
            })

        })
    }

    public returnReservedProduct(productId: number, quantity: number): Promise<string> {
        return this.addProductQuantity(productId, quantity)
    }

    private storeProductToInfo = (sp:StoreProduct):StoreProductInfo => {
        return new StoreProductInfo(
        sp.getName(),
        sp.getProductId(),
        sp.getPrice(),
        sp.getStoreId(),
        sp.getQuantity(),
        sp.getProductRating(),
        sp.getNumOfRaters(),
        sp.getCategories());
    }

    public getProductsInfo(): Promise<StoreProductInfo[]> {
        let storeProductsp: Promise<StoreProduct[]> = productDB.getAllProductByStoreId(this.storeId)
        let storepInfos: StoreProductInfo[] = []
        return new Promise((resolve,reject) => {
            storeProductsp.then( storeProducts => {
                for(let storeProduct of storeProducts){
                    storepInfos.push(this.storeProductToInfo(storeProduct));
                }
                resolve(storepInfos)
            }).catch(err => reject(err))
        })
    }

    public getProductInfoByName(productName:string): Promise<StoreProductInfo> {
        let storeProductp: Promise<StoreProduct> = productDB.getProductByStoreId(this.storeId, productName)
        return new Promise((resolve,reject) => {
            storeProductp.then( storeProduct => {
                resolve(this.storeProductToInfo(storeProduct))
            }).catch(err => reject('coudlnt find product with name'))
        })
    }

    public getProductInfoByCategory(category: string): Promise<StoreProductInfo[]>{
        let storeProductsp: Promise<StoreProduct[]> = productDB.getAllProductByStoreId(this.storeId)
        let storeProductsInfo: StoreProductInfo[] = []
        return new Promise((resolve,reject) => {
            storeProductsp.then(storeProducts => {
                for(let storeProduct of storeProducts){
                    if(storeProduct.getCategories().find(productCategory=>category===productCategory)!= undefined){
                        storeProductsInfo.push(this.storeProductToInfo(storeProduct));
                    }
                }
                resolve(storeProductsInfo)
            }).catch(err => reject(err))
        })
    }

    public getProductInfoByFilter(filter: (x: StoreProduct) => boolean): Promise<StoreProductInfo[]>{
        let storeProductsp: Promise<StoreProduct[]> = productDB.getAllProductByStoreId(this.storeId)
        let storeProductsInfo: StoreProductInfo[] = []
        return new Promise((resolve,reject) => {
            storeProductsp.then(storeProducts => {
                storeProductsInfo = storeProducts.filter(filter).map(storeProduct => {
                  return this.storeProductToInfo(storeProduct)
                })
            resolve(storeProductsInfo)
            }).catch(err => reject(err))
        })
    }

    public getProductPrice(productId: number): Promise<number>
    {
        let productp = productDB.getProductById(productId)
        return new Promise((resolve, reject) => {
            productp.then(product => {
                if(product === undefined){
                    resolve(-1);
                }
                else resolve(product.getPrice());
            }).catch(error => reject(error))
        })

    }

    public getProductById(productId : number) : Promise<StoreProduct>
    {
        return productDB.getProductById(productId);
    }
}