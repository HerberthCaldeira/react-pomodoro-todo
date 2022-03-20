import {useState} from 'react';
import Form from './components/Form';
import Lista from './components/Lista';
import Pomodoro from './components/pomodoro/Pomodoro';


function App() {  
  const [lista, setLista] = useState(JSON.parse(localStorage.getItem('lista')) || []);

  return (
    <div className="container mx-auto">
      <div className="flex flex-row">
        <Pomodoro />
        <div className="flex-grow">

          <Form lista={lista} setListaProps={setLista}/>
          <Lista lista={lista} setListaProps={setLista}/>    
        </div>
      </div>
    </div>
  );
}

export default App;
