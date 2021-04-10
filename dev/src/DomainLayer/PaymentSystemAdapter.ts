
class PaymentSystemAdapter {
    charge = (cardNumber: string, expiration: string, cvv: string):boolean => {
        return false;
    }
    refund = (cradNumber: string, expiration: string, cvv: string):boolean => {
        return false;
    }

}

export default PaymentSystemAdapter;