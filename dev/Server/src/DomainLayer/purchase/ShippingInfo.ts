class ShippingInfo{
    public userId: number;
    public storeId: number;
    public userAddress: string;
    public storeAddress: string;

    
    constructor(userId: number,storeId: number,userAddress: string,storeAddress: string){
        this.userId = userId;
        this.storeId = storeId;
        this.userAddress = userAddress;
        this.storeAddress = storeAddress;
    }
}

export default ShippingInfo;