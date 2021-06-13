import Transaction, { TransactionStatus } from "../../DomainLayer/purchase/Transaction";
import { sequelize } from "../connectDb";
import { DB } from "../DBfacade";
import { iPurchaseDB } from "../interfaces/iPurchaseDB";


export class purchaseDB implements iPurchaseDB
{
    public async completeTransaction(transaction: Transaction):Promise<boolean>
    {
        console.log("transaction:",transaction)
        const t = await sequelize.transaction();
        try
        {
            await sequelize.models.Transaction.create({
                id: transaction.getId(),
                userId: transaction.getUserId(),
                storeId: transaction.getStoreId(),
                storeName: transaction.getStoreName(),
                total: transaction.getTotal(),
                cardNumber: transaction.getCardNumber(),
                status: transaction.getStatus(),
                time: transaction.getTime(),
                shipmentId: transaction.getShipmentId(),
                paymentId: transaction.getPaymentId()
            },
            {
                transaction: t
            })
            for(let [itemId, [quantity, productName, price]] of transaction.getItems())
            {
                await sequelize.models.TransactionItem.create({
                    ProductId: itemId,
                    quantity: quantity,
                    name: productName,
                    price: price,
                    TransactionId: transaction.getId()
                },
                {
                    transaction: t
                })
                await sequelize.models.StoreProduct.update(
                    {
                        quantity: sequelize.literal(`quantity - ${quantity}`)
                    },
                    {
                        where:{
                            id: itemId
                        },
                        transaction: t
                })
            }        
        }
        catch(e)
        {
            console.log(e)
            console.log('rollback')
            await t.rollback();
            return Promise.resolve(false)
        }

        return new Promise((resolve,reject) => {
            let subscriberp = DB.getSubscriberById(transaction.getUserId())
            subscriberp.then( async (subscriber) => {
                let basket = await sequelize.models.ShoppingBasket.findOne({
                    where:{
                        SubscriberId: transaction.getUserId(),
                        StoreId: transaction.getStoreId()
                    }
                });
        
                let basketId = basket.id;
                await sequelize.models.BasketProduct.destroy(
                    {
                        where:
                        {
                            ShoppingBasketId : basketId,
                        },
                        transaction: t
                    }
                )
                await sequelize.models.ShoppingBasket.destroy(
                    {
                        where:
                        {
                            SubscriberId : transaction.getUserId(),
                            StoreId :transaction.getStoreId(),
                        },
                        transaction: t
                    }
                )
                try{
                    await t.commit()
                    resolve(true)
                }
                catch(e){
                    await t.rollback();
                    reject("couldnt save transaction")
                }
            })
            .catch(async (err) => {
                console.log("guest")
                try{
                    await t.commit();
                    resolve(true)
                }
                catch(e){
                    await t.rollback();
                    reject("couldnt save transaction")
                }
            })
        })
        
        
    }

    public async getLastTransactionId(): Promise<number>
    {
        let lastId = await sequelize.models.Transaction.max('id')
        if (lastId === null)
            return 0;
        return lastId + 1
    }

    public async getAllTransactions(): Promise<Transaction[]>
    {
        let transactionsDB = await sequelize.models.Transaction.findAll()
        if(transactionsDB === null)
        return Promise.resolve([]);

        let transactions = [];
        for(let transaction of transactionsDB)
        {
            let items = await sequelize.models.TransactionItem.findAll(
                {
                    where:
                    {
                        TransactionId: transaction.id
                    }
                }
            )
            transactions.push(Transaction.rebuild(transaction, items));
        }
        transactions.sort((a,b) => {
            const dt:number = b.getTime() - a.getTime();
            return dt !== 0 ? dt : a.getStatus() - b.getStatus();
        })
        return transactions
    }

    public async getCompletedTransactions():Promise<Transaction[]>
    {
        let transactionsDB = await sequelize.models.Transaction.findAll({
            where:
            {
                status: TransactionStatus.COMPLETE
            }
        })
        if(transactionsDB === null)
        return Promise.resolve([]);

        let transactions = [];
        for(let transaction of transactionsDB)
        {
            let items = await sequelize.models.TransactionItem.findAll(
                {
                    where:
                    {
                        TransactionId: transaction.id
                    }
                }
            )
            transactions.push(Transaction.rebuild(transaction, items));
        }
        transactions.sort((a,b) => {
            const dt:number = b.getTime() - a.getTime();
            return dt !== 0 ? dt : a.getStatus() - b.getStatus();
        })
        return transactions
    }

    public async storeTransaction(transaction: Transaction) : Promise<void>
    {
        await sequelize.models.Transaction.create({
            id: transaction.getId(),
            userId: transaction.getUserId(),
            storeId: transaction.getStoreId(),
            storeName: transaction.getStoreName(),
            total: transaction.getTotal(),
            cardNumber: transaction.getCardNumber(),
            status: transaction.getStatus(),
            time: transaction.getTime(),
            shipmentId: transaction.getShipmentId(),
            paymentId: transaction.getPaymentId()
        })
        for(let [itemId, [quantity, productName, price]] of transaction.getItems())
        {
            await sequelize.models.TransactionItem.create({
                ProductId: itemId,
                quantity: quantity,
                name: productName,
                price: price,
                TransactionId: transaction.getId()
            })
        }
    }
    public async getTransactionInProgress(userId: number, storeId: number): Promise<Transaction>
    {
        let transactions = await sequelize.models.Transaction.findAll(
            {
                where:
                {
                    userId: userId,
                    storeId: storeId,
                    status: TransactionStatus.IN_PROGRESS
                }
            }
        )
        if(transactions === null)
        {
            return Promise.reject(null);
        }
        if(transactions.length > 1)
        {
            throw  (`userId: ${userId} and storeId: ${storeId} have ${transactions.length} transactions in progress.\n should be at most 1`);
        }
        let items = await sequelize.models.TransactionItem.findAll(
            {
                where:
                {
                    TransactionId: transactions[0].id
                }
            }
        )

        return Promise.resolve(Transaction.rebuild(transactions[0], items));
    }

    public async getTransactionsInProgress(userId: number, storeId: number): Promise<Transaction[]>
    {
        let transactionsDB = await sequelize.models.Transaction.findAll(
            {
                where:
                {
                    userId: userId,
                    storeId: storeId,
                    status: TransactionStatus.IN_PROGRESS
                }
            }
        )
        if(transactionsDB === null)
        return Promise.resolve([]);

    let transactions = [];
    for(let transaction of transactionsDB)
    {
        let items = await sequelize.models.TransactionItem.findAll(
            {
                where:
                {
                    TransactionId: transaction.id
                }
            }
        )
        transactions.push(Transaction.rebuild(transaction, items));
    }
    transactions.sort((a,b) => {
        const dt:number = b.getTime() - a.getTime();
        return dt !== 0 ? dt : a.getStatus() - b.getStatus();
    })
    return transactions
    }


    public async updateTransaction(transaction: Transaction): Promise<void>
    {
        await sequelize.models.Transaction.update(
            {
            userId: transaction.getUserId(),
            storeId: transaction.getStoreId(),
            storeName: transaction.getStoreName(),
            total: transaction.getTotal(),
            cardNumber: transaction.getCardNumber(),
            status: transaction.getStatus(),
            time: transaction.getTime(),
            shipmentId: transaction.getShipmentId(),
            paymentId: transaction.getPaymentId()
            },
            {
            where:
            {
                id: transaction.getId()
            }
        })
    }


    public async getUserStoreHistory(userId: number, storeId: number): Promise<Transaction[]>
    {
        let transactionsDB = await sequelize.models.Transaction.findAll(
            {
                where:
                {
                    userId: userId,
                    storeId: storeId,
                }
            }
        )
        if(transactionsDB === null)
            return Promise.resolve([]);

        let transactions = [];
        for(let transaction of transactionsDB)
        {
            let items = await sequelize.models.TransactionItem.findAll(
                {
                    where:
                    {
                        TransactionId: transaction.id
                    }
                }
            )
            transactions.push(Transaction.rebuild(transaction, items));
        }
        transactions.sort((a,b) => {
            const dt:number = b.getTime() - a.getTime();
            return dt !== 0 ? dt : a.getStatus() - b.getStatus();
        })
        return transactions
    }


    clear: () => void;
    public willFail= () =>{
        throw new Error("can not force failure outside of test mode")
    }
    public willSucceed= () =>{
        throw new Error("can not force success outside of test mode")
    }

}