import axios from 'axios';
import React, { useState } from 'react';
import { SERVER_BASE_URL, SERVER_RESPONSE_BAD, SERVER_RESPONSE_OK } from '../../constants';
import ReadMessage from '../messaging/ReadMessage';
import WriteMessage from '../messaging/WriteMessage';

const ViewComplaint=({getAppState, setAppState, message})=>{
    const [isReadMode, setIsReadMode] = useState(true);
    const [replyMessage, setReplyMessage] = useState({title:`Reply: ${message.title}`, body:"", id:message.id})
    const {userId, complaints} = getAppState();
    const {id} = message;

    const onReplyClick = async() => {
        setIsReadMode(false);
    }
    
    const onDeleteClick = async() => {
        //send message to server to delete
        const response = await axios.post(`${SERVER_BASE_URL}deleteComplaint`,{
            userId, messageId:id
        });
        switch(response.status){
            case SERVER_RESPONSE_OK:
                setAppState({complaints: complaints.filter(c => c.id !== id)});
                break;
            case SERVER_RESPONSE_BAD:
                alert(`Could not send message.\n${response.data.message}`);
                break;
            default:
                alert(`Could not send message.`);
                break;
        }
        // const {complaints} = getAppState();
        // setAppState({complaints:complaints.filter(c => c !== message)});
        // alert("deleting message");
    }
    

    const onSendReplyClick = async () => {
        const response = await axios.post(`${SERVER_BASE_URL}replyToComplaint`,{
            userId, message
        })
        switch(response.status){
            case SERVER_RESPONSE_OK:
                alert(response.data);
                setIsReadMode(true);
                break;
            case SERVER_RESPONSE_BAD:
                alert(`Could not send message.\n${response.data.message}`);
                break;
            default:
                alert(`Could not send message.`);
                break;
        }
        // setIsReadMode(true);
    }

    const onCancelReplyClick = async() => {
        setIsReadMode(true);
    }


    return (
        isReadMode ?
        <ReadMessage message={message} onReplyClick={onReplyClick} onDeleteClick={onDeleteClick}/> :
        <WriteMessage getMessage={()=>replyMessage} setMessage={setReplyMessage} onSendClick={onSendReplyClick} onCancelClick={onCancelReplyClick}/>
    )

}

export default ViewComplaint;
