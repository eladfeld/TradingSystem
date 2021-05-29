import React, { useState } from 'react';
import CompositePredicate from './CompositePredicate';
import NoTypePredicate from './NoTypePredicate';
import SimplePredicate from './SimplePredicate';

const Predicate = ({getPredicateState, setPredicateState}) => {
    const predicate = getPredicateState();
    if(!predicate.type)predicate.type="";

    // const [predicate, SetPredicate] = useState(pred);
    // const getPredicateState = () => predicate;
    // const setPredicateState = (newPredicate) => SetPredicate(newPredicate);

    //TODO:have dropdown menu and onchange handler
    switch(predicate.type){
        case "simple":
            return <SimplePredicate getPredicateState={getPredicateState} setPredicateState={setPredicateState}/>
        case "composite":
            return <CompositePredicate getPredicateState={getPredicateState} setPredicateState={setPredicateState}/>
        default:
            return <NoTypePredicate getPredicateState={getPredicateState} setPredicateState={setPredicateState}/>

    }
}

export default Predicate;