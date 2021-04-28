import logo from './logo.svg';
import './App.css';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';


function App() {
  return (
    <div className="App">
      <header className="App-header">
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

export default App;
