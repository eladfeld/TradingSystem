import axios from 'axios';
import { BrowserRouter, Route, Router } from 'react-router-dom';

import Authentication from './Authentication'
import Enter from './Enter'
import { useState } from 'react';
import history from '../history';
import Welcome from './Welcome';
import React from 'react';
import Banner from './Banner';
import Transactions  from './Transactions';
import Cart  from './Cart';
import { Complain } from './Complain';
import { OpenStore } from './OpenStore';
import Checkout from './Checkout';
import {SERVER_BASE_URL} from '../constants'
import { Search, SearchByName, SearchAbovePrice, SearchAboveRating, SearchBelowPrice, SearchByCategory, SearchByKeyword} from './Search'

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
          <Route
            path='/cart' exact
            render={(props) => (
              <Cart {...props} getAppState={this.getAppState} setAppState={this.setAppState} />
            )}
          />
          <Route
            path='/complain' exact
            render={(props) => (
              <Complain {...props} getAppState={this.getAppState} setAppState={this.setAppState} />
            )}
          />
          <Route
            path='/openstore' exact
            render={(props) => (
              <OpenStore {...props} getAppState={this.getAppState} setAppState={this.setAppState} />
            )}
          />
          <Route
            path='/checkout' exact
            render={(props) => (
              <Checkout {...props} getAppState={this.getAppState} setAppState={this.setAppState} />
            )}
          />
          <Route
            path='/search' exact
            render={(props) => (
              <Search {...props} getAppState={this.getAppState} setAppState={this.setAppState} />
            )}
          />
          <Route
            path='/search/name' exact
            render={(props) => (
              <SearchByName {...props} getAppState={this.getAppState} setAppState={this.setAppState} />
            )}
          />
          <Route
            path='/search/category' exact
            render={(props) => (
              <SearchByCategory {...props} getAppState={this.getAppState} setAppState={this.setAppState} />
            )}
          />
          <Route
            path='/search/keyword' exact
            render={(props) => (
              <SearchByKeyword {...props} getAppState={this.getAppState} setAppState={this.setAppState} />
            )}
          />
          <Route
            path='/search/aboveprice' exact
            render={(props) => (
              <SearchAbovePrice {...props} getAppState={this.getAppState} setAppState={this.setAppState} />
            )}
          />
          <Route
            path='/search/belowprice' exact
            render={(props) => (
              <SearchBelowPrice {...props} getAppState={this.getAppState} setAppState={this.setAppState} />
            )}
          />
          <Route
            path='/search/aboverating' exact
            render={(props) => (
              <SearchAboveRating {...props} getAppState={this.getAppState} setAppState={this.setAppState} />
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
  axios.post(`${SERVER_BASE_URL}getWordList`, {word: value} ).then((response) => response.data.list.map((e) => options.push(e))).catch((error) => alert("error"));
}
const options = ['Option 1', 'Option 2'];

export default App;
