import WriteMessage from "./messaging/WriteMessage";
import { useState } from "react";
import axios from "axios";
import { SERVER_BASE_URL, SERVER_RESPONSE_BAD, SERVER_RESPONSE_OK } from "../constants";
import history from "../history";
export const Complain = ({getAppState, setAppState, exitMessage}) => {
    // getMessage: any;
    // setMessage: any;
    // onSendClick: any;
    // onCancelClick: any;
    const {userId, username} = getAppState();
    const [message, setMessage] = useState({title:"", body:"", authorName:username});
    if(!exitMessage)exitMessage=()=>history.push('/welcome');

    const onSendClick = async() =>{
        const response = await axios.post(SERVER_BASE_URL+'/complain',{userId, message});
        switch(response.status){
            case SERVER_RESPONSE_OK:
                alert('message sent!');
                exitMessage();
                return;
            case SERVER_RESPONSE_BAD:
                alert(response.data);
                return;
            default:
                alert(`unexpected response code: ${response.status}`);
                return;
        }
    }

    const onCancelClick = () => {
        exitMessage();
    }

    return(
        <WriteMessage
            getMessage = {() => message}
            setMessage = {setMessage}
            onSendClick = {onSendClick}
            onCancelClick = {onCancelClick} />
    );
};