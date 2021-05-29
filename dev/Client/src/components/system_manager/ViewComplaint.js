import React, { useState } from 'react';
import ReadMessage from '../messaging/ReadMessage';
import WriteMessage from '../messaging/WriteMessage';

const ViewComplaint=({getAppState, setAppState, message})=>{
    const [isReadMode, setIsReadMode] = useState(true);
    const [replyMessage, setReplyMessage] = useState({title:`Reply: ${message.title}`, body:""})
    const {userId} = getAppState();
    const {authorName, authorId} = message;

    const onReplyClick = async() => {
        setIsReadMode(false);
    }
    
    const onDeleteClick = async() => {
        //send message to server to delete
        // const response = await axios.post(`${SERVER_BASE_URL}deleteComplaint`,{
        //     userId, message, dest:authorId
        // });
        // switch(response.status){
        //     case SERVER_RESPONSE_OK:
        //         alert(`sent reply to ${authorName}`);
        //         break;
        //     case SERVER_RESPONSE_BAD:
        //         alert(`Could not send message.\n${response.data.message}`);
        //         break;
        //     default:
        //         alert(`Could not send message.`);
        //         break;
        //}
        const {complaints} = getAppState();
        setAppState({complaints:complaints.filter(c => c !== message)});
        alert("deleting message");
    }
    

    const onSendReplyClick = async () => {
        alert(`sending reply to ${authorName}`);
        // const response = await axios.post(`${SERVER_BASE_URL}replyToComplaint`,{
        //     userId, message, dest:authorId
        // })
        // switch(response.status){
        //     case SERVER_RESPONSE_OK:
        //         alert(`sent reply to ${authorName}`);
        //         setIsReadMode(true);
        //         break;
        //     case SERVER_RESPONSE_BAD:
        //         alert(`Could not send message.\n${response.data.message}`);
        //         break;
        //     default:
        //         alert(`Could not send message.`);
        //         break;
        // }
        setIsReadMode(true);
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
