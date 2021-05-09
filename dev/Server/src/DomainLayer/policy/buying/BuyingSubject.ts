import iSubject from "../../discount/logic/iSubject";


//A composite form of the iSubject
export default class BuyingSubject implements iSubject{

    private user: iSubject;
    private basket: iSubject;

    constructor(user: iSubject, basket: iSubject){
        this.user = user;
        this.basket = basket;
    }
    
    public getValue = (field: string) : number =>{
        switch (field) {
            case "time":
                const now = new Date();
                return now.getHours()*100 + now.getMinutes();
            case "date":
                return new Date().getDate();
            default:
                break;
        }

        if(field.length<3)
            return undefined;
        const prefix: string = field.substring(0,2);
        const rest: string = field.substring(2, field.length);

        switch (prefix) {
            case "u_":
                return this.user.getValue(rest);
            case "b_":
                return this.basket.getValue(rest);    
            default:
                break;
        }

        return undefined;
    };

    public getUser = ():iSubject => this.user;
    public getBasket = ():iSubject => this.basket;

}