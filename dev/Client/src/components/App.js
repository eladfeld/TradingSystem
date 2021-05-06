import axios from 'axios';
import { BrowserRouter, Route, Router } from 'react-router-dom';

import Authentication from './Authentication'
import Enter from './Enter'
import { useState } from 'react';
import history from '../history';
import Welcome from './Welcome';
import React from 'react';
import Banner from './Banner';
import { Transactions } from './Transactions';

//import {BrowserRouter as Router, Route} from 'react-router-dom'


class App extends React.Component
{
  constructor(){
    super();
    this.state = {userId: 0};
  }
  getAppState = () => this.state;
  setAppState = (state) => this.setState(state);

  render(){
    //const [userId, setUserId] = useState(0);
    return(
      <Router history={history}>
        <div>
          <Route
            path='/' exact
            render={(props) => (
              <Enter {...props} setAppState={this.setAppState} />
            )}
          />
          <Route
            path='/auth' exact
            render={(props) => (
              <Authentication {...props} getAppState={this.getAppState} setAppState={this.setAppState} />
            )}
          />
          <Route
            path='/welcome' exact
            render={(props) => (
              <Banner {...props} getAppState={this.getAppState} setAppState={this.setAppState} />
            )}
          />
          <Route
            path='/transactions' exact
            render={(props) => (
              <Transactions {...props} getAppState={this.getAppState} setAppState={this.setAppState} />
            )}
          />
        </div>
      </Router>
    );

    }
}
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <Autocomplete
//           id='combo-box-demo'
//           options={options}
//           filterOptions={(x) => x}
//           onInputChange={(event, value, reason) => {
//             if (reason === 'input') {
//               changeOptionBaseOnValue(value);
//             }
//           }}
//           renderInput={(params) => (
//             <div ref={params.InputProps.ref}>
//               <input style={{ width: 200 }} type="text" {...params.inputProps} />
//             </div>
//           )}
//         />
//         <ButtonGroup>
//           <Button 
//             onClick={()=> alert('register')}
//             variant="contained" 
//             color="primary">
//             register
//           </Button>
//           <Button onClick={()=> alert('sign in')} 
//           variant="contained" 
//           color="secondary">
//             sign in
//           </Button>
//         </ButtonGroup>
//         <TextField
//         label="username"
//         >
//         </TextField>
//         <TextField
//         label="password"
//         type="password"
//         >
//         </TextField>
//         <img src={logo} className="App-logo" alt="logo" />
//       </header>
//     </div>
//   );
// }

function changeOptionBaseOnValue(value)
{
  axios.post('http://192.168.56.1:3333/command/getWordList', {word: value} ).then((response) => response.data.list.map((e) => options.push(e))).catch((error) => alert("error"));
}
const options = ['Option 1', 'Option 2'];

export default App;
