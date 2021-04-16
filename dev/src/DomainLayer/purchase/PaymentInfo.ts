export class PaymentInfo{
    private cardNumber: number;
    private cvv: number;
    private expiration: number;

    getCardNumber = ():number => this.cardNumber;
    getCvv = ():number => this.cvv;
    getExpiration = ():number => this.expiration;

}