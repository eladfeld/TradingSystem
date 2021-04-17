class PaymentInfo{
    private cardNumber: number;
    private cvv: number;
    private expiration: number;

    constructor(cardNumber: number, cvv: number, expiration: number){
        this.cardNumber=cardNumber;
        this.cvv=cvv;
        this.expiration=expiration;
    }

    getCardNumber = ():number => this.cardNumber;
    getCvv = ():number => this.cvv;
    getExpiration = ():number => this.expiration;

}