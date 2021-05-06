import React from 'react';




class Welcome extends React.Component{


    constructor({getAppState, setAppState}){
        super();
        const {userId} = getAppState();
        this.state = {userId};
        console.log(userId);
    }


    render=()=>{
        return <div>Welcome {this.state.userId}</div>;
    }


}

export default Welcome;