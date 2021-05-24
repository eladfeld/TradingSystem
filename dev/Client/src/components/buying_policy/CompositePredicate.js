import Predicate from "./Predicate";




const CompositePredicate=({getPredicateState, setPredicateState})=>{
    const predicate = getPredicateState();
    const {operator, operands} = predicate;
    console.log('[t] composite pred:', predicate);
    return(
        <div>
            <h1>Composite Predicate</h1>
            <h3>operator: {operator}</h3>
            <div>
                {operands.map(rand => { return <Predicate pred={rand}/>;})}
                {/* {operands.map(rand => {
                    console.log('[t] child pred:',rand)
                    return <div>child</div>;
                     })} */}
            </div>
        </div>
    );
}

export default CompositePredicate



