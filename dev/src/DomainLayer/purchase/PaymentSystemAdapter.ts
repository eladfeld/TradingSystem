
class PaymentSystemAdapter {
    charge = (paymentInfo: PaymentInfo):boolean => {
        return false;
    }
    refund = (paymentInfo: PaymentInfo):boolean => {
        return false;
    }

}

export default PaymentSystemAdapter;