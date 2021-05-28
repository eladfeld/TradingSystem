import axios from 'axios';
import {Route, Router } from 'react-router-dom';

import Authentication from './Authentication'
import Enter from './Enter'
import history from '../history';
import React from 'react';
import Banner from './Banner';
import Cart  from './Cart';
import { Complain } from './Complain';
import { OpenStore } from './OpenStore';
import Checkout from './Checkout';
import { Search, SearchByName, SearchAbovePrice, SearchByStore, SearchBelowPrice, SearchByCategory, SearchByKeyword} from './Search'
import { SERVER_BASE_URL } from '../constants';
import MyTransactions from './MyTransactions';
import MyTransaction from './MyTransaction';
import Register from './Register';
import ManageStores from './ManageStores'
import ManageStore from './ManageStore'
import { ROUTE_MANAGE_EMPLOYEE } from '../routes';
import ManageEmployee from './ManageEmployee';
import ManageSystem from './ManageSystem';
import Checkout2 from './Checkout2';


//import {BrowserRouter as Router, Route} from 'react-router-dom'
class App extends React.Component
{
  constructor(){
    super();
    this.state = {userId: 0};
  }
  getAppState = () => this.state;
  setAppState = (state) => this.setState(state);
  intersect = (products, newProducts) => {
    if(products !== null && products !== undefined && products.length !== 0){
      let intersection = new Set([...products].filter(x => {
        return newProducts.reduce((acc, curr) => acc || x.productId === curr.productId, false)
      }));
      console.log('intersection')
      console.log(intersection)
      console.log('products')
      console.log(products)
      console.log('newProducts')
      console.log(newProducts)
      this.setAppState({products: Array.from(intersection)})

    }
    else{
      this.setAppState({products:newProducts})

    }
}
  render(){
    //const [userId, setUserId] = useState(0);
    if(this.state.userId === 0)
      history.push('/');
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
            path='/manageStores' exact
            render={(props) => (
              <ManageStores {...props} getAppState={this.getAppState} setAppState={this.setAppState} />
            )}
          />
          <Route
            path='/auth' exact
            render={(props) => (
              <Authentication {...props} getAppState={this.getAppState} setAppState={this.setAppState} />
            )}
          />
          <Route
            path='/register' exact
            render={(props) => (
              <Register {...props} getAppState={this.getAppState} setAppState={this.setAppState} />
            )}
          />
          <Route
            path='/welcome' exact
            render={(props) => (
              <Banner {...props} getAppState={this.getAppState} setAppState={this.setAppState} />
            )}
          />
          <Route
            path='/mytransactions' exact
            render={(props) => (
              <MyTransactions {...props} getAppState={this.getAppState} setAppState={this.setAppState} />
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
              <Checkout2 {...props} getAppState={this.getAppState} setAppState={this.setAppState} />
            )}
          />
          <Route
            path='/search' exact
            render={(props) => (
              <Search {...props} getAppState={this.getAppState} setAppState={this.setAppState} intersect={this.intersect}/>
            )}
          />
          <Route
            path='/search/name' exact
            render={(props) => (
              <SearchByName {...props} getAppState={this.getAppState} setAppState={this.setAppState} intersect={this.intersect}/>
            )}
          />
          <Route
            path='/search/category' exact
            render={(props) => (
              <SearchByCategory {...props} getAppState={this.getAppState} setAppState={this.setAppState} intersect={this.intersect}/>
            )}
          />
          <Route
            path='/search/keyword' exact
            render={(props) => (
              <SearchByKeyword {...props} getAppState={this.getAppState} setAppState={this.setAppState} intersect={this.intersect}/>
            )}
          />
          <Route
            path='/search/aboveprice' exact
            render={(props) => (
              <SearchAbovePrice {...props} getAppState={this.getAppState} setAppState={this.setAppState} intersect={this.intersect}/>
            )}
          />
          <Route
            path='/search/belowprice' exact
            render={(props) => (
              <SearchBelowPrice {...props} getAppState={this.getAppState} setAppState={this.setAppState} intersect={this.intersect}/>
            )}
          />
          <Route
            path='/search/store' exact
            render={(props) => (
              <SearchByStore {...props} getAppState={this.getAppState} setAppState={this.setAppState} intersect={this.intersect}/>
            )}
          />
          <Route

            path='/viewmytransaction' exact
            render={(props) => (
              <MyTransaction {...props} getAppState={this.getAppState} setAppState={this.setAppState} />
            )}
          />
          <Route
            path= '/store/:storeId' exact
            render={(props) => (
              <ManageStore {...props} getAppState={this.getAppState} setAppState={this.setAppState} />
            )}
          />
          <Route
            path= '/managesystem' exact
            render={(props) => (
              <ManageSystem {...props} getAppState={this.getAppState} setAppState={this.setAppState} />
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
