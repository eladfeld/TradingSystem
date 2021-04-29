export const TransactionStatus = {
    IN_PROGRESS: 0,
    CANCELLED: 1,
    TIMED_OUT: 2,
    COMPLETE: 3
};

Object.freeze(TransactionStatus);

class Transaction {

    private transcationId: number;//
    private userId: number;//
    private storeId: number;//
    private total: number;//
    private cardNumber: number;//
    private items: Map<number, number>; //productId => quantity
    private status: number;//
    private time: number;//
    private shipmentId: number;//
    private paymentId: number;//
    
    private static nextId = 1;

    asJson = () => {
        var obj : any = {}
        obj['transcationId'] = this.transcationId
        obj['userId'] = this.userId
        obj['storeId'] = this.storeId
        obj['total'] = this.total
        obj['cardNumber'] = this.cardNumber
        obj['status'] = this.status
        obj['time'] = this.time
        obj['shipmentId'] = this.shipmentId

        var items = [];
        for(const [key, value] of this.items){
            items.push({ 
                'productId':key,
                'quantity':value,
            });
        }
        obj['items']=items;
        return obj;
    }

    constructor(userId: number, storeId: number, items: Map<number, number>, total:number ){
        this.transcationId = Transaction.nextId++;
        this.userId = userId;
        this.storeId = storeId;
        this.items = items;//this.cartToTree(user.shoppingCart);
        this.total = total;//this.basketTotal(this.items);
        this.status = TransactionStatus.IN_PROGRESS;
        this.time = Date.now();
        this.cardNumber = null;
        this.shipmentId = -1;
    }

    setShipmentId = (shipmentId: number):void => {this.shipmentId = shipmentId;}
    setPaymentId = (paymentId: number):void => {this.paymentId = paymentId;}
    setStatus = (status: number) =>{this.status = status;}
    setCardNumber = (cardNumber: number) => {this.cardNumber = cardNumber;}

    getTotal = (): number => this.total;
    getId = () : number => this.transcationId;
    getShipmentId = () : number => this.shipmentId;
    getPaymentId = () : number => this.paymentId;
    getUserId = () : number => this.userId;
    getStoreId = () : number => this.storeId;
    getItems = () : Map<number, number> => this.items;
    getStatus = () : number => this.status;
    getTime = () : number => this.time;

    toJSON = () => {
        var obj : any = {};
        obj['transcationId'] = this.transcationId;
        obj['userId'] = this.userId;
        obj['storeId'] = this.storeId;
        obj['total'] = this.total;
        obj['cardNumber'] = this.cardNumber;
        obj['status'] = this.status;
        obj['time'] = this.time;
        obj['shipmentId'] = this.shipmentId;

        obj['items']=[];
        for(const [key, value] of this.items){
            obj['items'].push({ 
                'productId':key,
                'Quantity':value,
            });
        }
        return obj;
    }  
}

export default Transaction;