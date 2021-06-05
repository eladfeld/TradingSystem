import WriteMessage from "./messaging/WriteMessage";
import { useState } from "react";
import axios from "axios";
import { SERVER_BASE_URL, SERVER_RESPONSE_BAD, SERVER_RESPONSE_OK } from "../constants";
import history from "../history";
import Alert from '@material-ui/lab/Alert';
import { Button} from '@material-ui/core'



export const Complain = ({getAppState, setAppState, exitMessage}) => {
    // getMessage: any;
    // setMessage: any;
    // onSendClick: any;
    // onCancelClick: any;
    const {userId, username} = getAppState();
    const [message, setMessage] = useState({title:"", body:"", authorName:username});
    if(!exitMessage)exitMessage=()=>history.push('/welcome');
    const [problem, setProblem] = useState("");
    const [success, setSuccess] = useState("");

    const onSendClick = async() =>{
        const response = await axios.post(SERVER_BASE_URL+'/complain',{userId, message});
        switch(response.status){
            case SERVER_RESPONSE_OK:
                setSuccess('message sent!');
                exitMessage();
                return;
            case SERVER_RESPONSE_BAD:
                setProblem(response.data);
                return;
            default:
                setProblem(`unexpected response code: ${response.status}`);
                return;
        }
    }

    const onCancelClick = () => {
        exitMessage();
    }

    return(
        
        <div>
            {
            problem !== "" ?
            <Alert
            action={
                <Button color="inherit" size="small" onClick={() => {setProblem("")}}>
                close
                </Button>
            }
            severity="error"> {problem}</Alert> : <a1></a1>
            }
            {   
            success !== "" ?
            <Alert
            action={
                <Button color="inherit" size="small" onClick={() => 
                {
                    setSuccess("");
                    history.push('/cart');
                }}>
                close
                </Button>
                }
            severity="success"> {success}</Alert> : <a1></a1>
            }
        <WriteMessage
            getMessage = {() => message}
            setMessage = {setMessage}
            onSendClick = {onSendClick}
            onCancelClick = {onCancelClick} />
        </div>
    );
};