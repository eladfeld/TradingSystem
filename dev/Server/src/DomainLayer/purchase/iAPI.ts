import { tPaymentInfo, tShippingInfo } from "./Purchase";

export interface iPaymentAdapter{
    init    : () => Promise<number>;
    transfer: (paymentInfo: tPaymentInfo) => Promise<number>;
    refund  : (transactionNumber: number) =>Promise<boolean>;
    // willSucceed: () => void;
    // willFail: () => void;
}

export interface iSupplyAdapter{
    init    : () => Promise<number>;
    supply: (shippingInfo: tShippingInfo) => Promise<number>;
    cancelSupply  : (transactionNumber: number) =>Promise<boolean>;
    // willSucceed: () => void;
    // willFail: () => void;
}