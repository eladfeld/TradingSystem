import { Button, Paper, TextField } from "@material-ui/core";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';

import Discount from "./Discount";




const ComboDiscount=({getDiscountState, setDiscountState})=>{
    const discount = getDiscountState();
    const {type, policy, discounts} = discount;

    if(!discounts) setDiscountState({type, policy, discounts:[]})

    const addDiscount = () => {
        setDiscountState({
            type,
            policy,
            discounts:[...discounts,{type:""}]
        })
    }; 

    const editDiscount = (idx, disc) => {
        discounts[idx] = disc;
        setDiscountState({type, policy, discounts})
    }

    const paperStyle={padding :20,width:'90%', margin:"20px auto"}
    //const avatarStyle={backgroundColor:'#1bbd7e'}
    const btnstyle={margin:'8px 0'}
    return(
        <Paper elevation={10} style={paperStyle}>

            <h3>Combo Discount</h3>
            <TextField
                label='combo policy'
                placeholder='Enter a policy (i.e. add, max)'
                value={policy}
                onChange={(event) => setDiscountState({...discount, policy:event.target.value})}
                />
            <div>
                {discounts? 
                    discounts.map((disc, idx) => { return <Discount getDiscountState={() => disc} setDiscountState={(d)=>editDiscount(idx,d)} />})
                     : "No children"}
            </div>
            <IconButton>
                <AddCircleIcon color="primary" fontSize="large" onClick={()=>addDiscount()}/>
            </IconButton>
        </Paper>

    );
}

export default ComboDiscount;



