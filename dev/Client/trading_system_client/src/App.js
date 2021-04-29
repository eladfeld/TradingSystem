import logo from './logo.svg';
import './App.css';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Autocomplete
          id='combo-box-demo'
          options={options}
          filterOptions={(x) => x}
          onInputChange={(event, value, reason) => {
            if (reason === 'input') {
              changeOptionBaseOnValue(value);
            }
          }}
          renderInput={(params) => (
            <div ref={params.InputProps.ref}>
              <input style={{ width: 200 }} type="text" {...params.inputProps} />
            </div>
          )}
        />
        <ButtonGroup>
          <Button 
            onClick={()=> alert('register')}
            variant="contained" 
            color="primary">
            register
          </Button>
          <Button onClick={()=> alert('sign in')} 
          variant="contained" 
          color="secondary">
            sign in
          </Button>
        </ButtonGroup>
        <TextField
        label="username"
        >
        </TextField>
        <TextField
        label="password"
        type="password"
        >
        </TextField>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

function changeOptionBaseOnValue(value)
{
  axios.post('http://192.168.56.1:3333/command/getWordList', {word: value} ).then((response) => response.data.list.map((e) => options.push(e))).catch((error) => alert("error"));
}
const options = ['Option 1', 'Option 2'];

export default App;
