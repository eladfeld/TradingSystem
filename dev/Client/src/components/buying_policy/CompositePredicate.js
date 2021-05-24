import { Button, Paper, TextField } from "@material-ui/core";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';

import Predicate from "./Predicate";




const CompositePredicate=({getPredicateState, setPredicateState})=>{
    const predicate = getPredicateState();
    const {type, operator, operands} = predicate;

    if(!operands) setPredicateState({type, operator,operands:[]})

    const addOperand = () => {
        setPredicateState({
            type,
            operator,
            operands:[...operands,{type:""}]
        })
    }; 

    const editOperand = (idx, pred) => {
        operands[idx] = pred;
        setPredicateState({type, operator, operands})
    }

    console.log('[t] composite pred:', predicate);
    const paperStyle={padding :20,width:'90%', margin:"20px auto"}
    //const avatarStyle={backgroundColor:'#1bbd7e'}
    const btnstyle={margin:'8px 0'}
    return(
        <Paper elevation={10} style={paperStyle}>

            <h3>Composite Predicate</h3>
            <TextField
                label='Operator'
                placeholder='Enter Operator and, or, xor, iff, =>'
                value={operator}
                onChange={(event) => setPredicateState({...predicate, operator:event.target.value})}
                />
            <div>
                {operands? 
                    operands.map((rand, idx) => { return <Predicate getPredicateState={() => rand} setPredicateState={(p)=>editOperand(idx,p)} />})
                     : "No children"}
            </div>
            <IconButton>
                <AddCircleIcon color="primary" fontSize="large" onClick={()=>addOperand()}/>
            </IconButton>
        </Paper>

    );
}

export default CompositePredicate



