import React, { useState } from 'react';
import CompositePredicate from './CompositePredicate';
import Predicate from './Predicate';
import SimplePredicate from './SimplePredicate';

const BuyingPolicy = ({predicate}) => {
    const [name, setName] = useState("");
    console.log('[t] predicate:',predicate);

    return(
        <Predicate pred={predicate}/>
    );
}

export default BuyingPolicy;