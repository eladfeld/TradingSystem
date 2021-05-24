import React, { useState } from 'react';
import CompositePredicate from './CompositePredicate';
import SimplePredicate from './SimplePredicate';

const Predicate = ({pred}) => {
    const [predicate, SetPredicate] = useState(pred);
    const getPredicateState = () => predicate;
    const setPredicateState = (newPredicate) => SetPredicate(newPredicate);

    //TODO:have dropdown menu and onchange handler
    console.log('[t] general render pred:', pred);
    switch(predicate.type){
        case "simple":
            return <SimplePredicate getPredicateState={getPredicateState} setPredicateState={setPredicateState}/>
        case "composite":
            return <CompositePredicate getPredicateState={getPredicateState} setPredicateState={setPredicateState}/>
        default:
            return <div><h1>Not a Predicate</h1></div>

    }
}

export default Predicate;