import React, { useState } from 'react';
import ComboDiscount from './ComboDiscount';
import ConditionalDiscount from './ConditionalDiscount';
import NoTypeDiscount from './NoTypeDiscount';
import UnconditionalDiscount from './UnconditionalDiscount';


const Discount = ({getDiscountState, setDiscountState}) => {
    const discount = getDiscountState();
    if(!discount.type)discount.type="";

    // const [predicate, SetPredicate] = useState(pred);
    // const getPredicateState = () => predicate;
    // const setPredicateState = (newPredicate) => SetPredicate(newPredicate);

    //TODO:have dropdown menu and onchange handler
    switch(discount.type){
        case "Unconditional":
            return <UnconditionalDiscount getDiscountState={getDiscountState} setDiscountState={setDiscountState}/>
        case "conditional":
            return <ConditionalDiscount getDiscountState={getDiscountState} setDiscountState={setDiscountState}/>
        case "combo":
            return <ComboDiscount getDiscountState={getDiscountState} setDiscountState={setDiscountState}/>
        default:
            return <NoTypeDiscount getDiscountState={getDiscountState} setDiscountState={setDiscountState}/>
    }
}

export default Discount;