class ShippingInfo{
    
    public name: string
    public address: string
    public city:string
    public country: string
    public zip:number

    
    constructor(name: string, address: string, city:string, country: string, zip:number){
        this.name = name;
        this.address = address;
        this.city = city;
        this.country = country;
        this.zip = zip;
    }
}

export default ShippingInfo;