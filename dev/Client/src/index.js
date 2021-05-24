import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import BuyingPolicy from './components/buying_policy/BuyingPolicy';
import Operand from './components/buying_policy/Operand'
import SimplePredicate from './components/buying_policy/SimplePredicate';
//import reportWebVitals from './reportWebVitals';

const sPred1 = {
  type: "simple",
  operand1: 1,
  operator: "<",
  operand2: 2
}
const sPred2 = {
  type: "simple",
  operand1: 3,
  operator: "<",
  operand2: 4
}

const cPred = {
  type:"composite",
  operator:"and",
  operands:[sPred1,sPred2]
}

ReactDOM.render(
    <BuyingPolicy predicate={cPred} />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
