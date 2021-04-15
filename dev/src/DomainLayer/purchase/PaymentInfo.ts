class PaymentInfo{
    private amount: number;
    private cardNumber: number;
    private cvv: number;
    private expiration: string;

    getCardNumber = () => this.cardNumber;
}