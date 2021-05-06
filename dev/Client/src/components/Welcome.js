import React from 'react';
import Banner from './Banner';




class Welcome extends React.Component{
    constructor({getAppState, setAppState}){
        super();
        const {userId} = getAppState();
        this.state = {userId};
        console.log(userId);
    }


    render=()=>{
        return (
            <div>
                <Banner getAppState={this.props.getAppState} setAppState={this.props.setAppState}/>
            </div>
        );
    }


}

export default Welcome;