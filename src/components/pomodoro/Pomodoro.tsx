import  { useEffect, useReducer } from "react";
import Display from "./display/Display";

const SECONDS = 60;
const WORK = 'work';
const SHORT_BREAK = 'shortBreak';
const LONG_BREAK = 'longBreak';

interface IintialValues {
    clockId: undefined | number;
    pomodoro_state_flow: string[];
    pomodoro_state_key: number;
    rounds: number;
    round_duration: number;
    roundTimeLeft: number;
    shortBreakTimeDuration: number;
    longBreakTimeDuration: number;
}

type Taction = 
 | { type: 'RESET' }
 | {type: 'set_clockId' | 'set_shortBreakTimeDuration' | 'set_longBreakTimeDuration' | 'set_round_duration' | 'set_rounds', payload: number} 
 | {type: 'decrement_rounds'}
 | {type: 'decrement_roundTimeLeft'}
 | {type: 'WORK'}
 | {type: 'SHORT_BREAK'}
 | {type: 'LONG_BREAK'}
 ;


const initialValues:IintialValues =  {
    clockId: undefined,
    pomodoro_state_flow: [WORK, SHORT_BREAK, LONG_BREAK],
    pomodoro_state_key: 0, 
    rounds: 1,
    round_duration: 1,
    roundTimeLeft: SECONDS,
    shortBreakTimeDuration: 1, 
    longBreakTimeDuration: 1 
}

const reducer  = (state: IintialValues, action: Taction) :IintialValues => {

    switch (action.type) {
        case 'RESET':
            return initialValues;
        case 'set_clockId':
            return {
                ...state,
                clockId: action.payload
            }
        case 'set_shortBreakTimeDuration':
            return {
                ...state,
                shortBreakTimeDuration: action.payload
            }
        case 'set_longBreakTimeDuration':
            return {
                ...state,
                longBreakTimeDuration: action.payload
            }
        case 'set_rounds':
            return {
                ...state,
                rounds: action.payload
            }
        case 'decrement_rounds':
            return {
                ...state,
                rounds: state.rounds - 1
            }
        case 'set_round_duration':
            return {
                ...state,
                round_duration: action.payload,
                roundTimeLeft: action.payload * SECONDS
            }      
        case 'decrement_roundTimeLeft':
            return {
                ...state,
                roundTimeLeft: state.roundTimeLeft - 1
            } 
        case 'WORK':
            return {
                ...state,
                pomodoro_state_key: 0,               
                roundTimeLeft: state.round_duration * SECONDS
            }
        case 'SHORT_BREAK':
            return {
                ...state,
                pomodoro_state_key: 1,
                roundTimeLeft: state.shortBreakTimeDuration * SECONDS
            }
        case 'LONG_BREAK':
            return {
                ...state,
                pomodoro_state_key: 2,
                roundTimeLeft: state.longBreakTimeDuration * SECONDS
            }
        default:
            return state
      
    }

}


const Pomodoro = () => {

    const [clock_settings, dispatch] = useReducer(reducer, initialValues)
        
    const clockColor = (state:string) => {
        switch(state){
            case WORK:
                return 'green';
            case SHORT_BREAK:
                return 'orange';
            case LONG_BREAK:
                return 'red'
            default:
                return '';
        }

    }
    

    const start = () => {       
        if(clock_settings.round_duration === 0) return;  
        if(clock_settings.clockId !== undefined) clearInterval(clock_settings.clockId);  

        const clock_id = window.setInterval(() => {
            dispatch({ type: 'decrement_roundTimeLeft' });       
        }, 1000); 

        dispatch({ type: 'set_clockId', payload: clock_id}); 
    }

    const stop = () => {
        clearInterval(clock_settings.clockId)
    }

    useEffect(()=>{    
        if( clock_settings.roundTimeLeft === 0 ){        
          
            clearInterval(clock_settings.clockId);              
            
            if(clock_settings.pomodoro_state_flow[clock_settings.pomodoro_state_key] === LONG_BREAK){                
                dispatch({type:'WORK'});
                return;
            } 
         
            if( clock_settings.rounds === 0 ){       
                dispatch({type:'LONG_BREAK'});
                start();
                return;               
            }; 
  
            if(clock_settings.pomodoro_state_flow[clock_settings.pomodoro_state_key] === WORK){                
                dispatch({type:'SHORT_BREAK'});            
            } 

            if(clock_settings.pomodoro_state_flow[clock_settings.pomodoro_state_key] === SHORT_BREAK){      
                dispatch({type:'WORK'});
                dispatch({type:'decrement_rounds'});               
            }

      
            
            start();
           
        }
    }, [clock_settings.roundTimeLeft, start, clock_settings.clockId, clock_settings.pomodoro_state_flow, clock_settings.pomodoro_state_key, clock_settings.rounds])



    return(
        <div className="mt-2 p-6 shadow-lg bg-white max-w-sm">
            N° de rounds:
            <input type="number"
                    min='1'
                    className="
                    form-control
                    block
                    w-full              
                    px-3 py-1.5
                    border border-solid border-gray-300 rounded" 
                    value={clock_settings.rounds}
                    onChange={(e) => dispatch({ type:'set_rounds', payload: parseInt(e.target.value) })}/>
            
            Duração dos rounds:
            <input type="number"
                    min='1'
                    className="
                    form-control
                    block
                    w-full              
                    px-3 py-1.5
                    border border-solid border-gray-300 rounded" 
                    value={clock_settings.round_duration}
                    onChange={(e) =>  dispatch({ type:'set_round_duration', payload: parseInt(e.target.value) }) }/>

            Duração da pausa cursa:
            <input type="number"
                    min='1'
                    className="
                    form-control
                    block
                    w-full              
                    px-3 py-1.5
                    border border-solid border-gray-300 rounded" 
                    value={clock_settings.shortBreakTimeDuration}
                    onChange={(e) =>  dispatch({ type:'set_shortBreakTimeDuration', payload: parseInt(e.target.value) }) }/>
           
  
           Duração da pausa longa:
            <input type="number"
                    min='1'
                    className="
                    form-control
                    block
                    w-full              
                    px-3 py-1.5
                    border border-solid border-gray-300 rounded" 
                    value={clock_settings.longBreakTimeDuration}
                    onChange={(e) =>  dispatch({ type:'set_longBreakTimeDuration', payload: parseInt(e.target.value) }) }/>
           
                <button className=" 
                    mt-2
                    px-6 py-2.5 text-xs
                    leading-tight uppercase text-white font-bold
                    rounded
                    shadow-md bg-blue-500 
                    hover:bg-blue-700" onClick={start}>start</button>

                <button className=" 
                    mt-2
                    px-6 py-2.5 text-xs
                    leading-tight uppercase text-white font-bold
                    rounded
                    shadow-md bg-red-500 
                    hover:bg-red-700" onClick={stop}>stop</button>

                    <Display timeLeft={ clock_settings.roundTimeLeft } clockColor={clockColor(clock_settings.pomodoro_state_flow[clock_settings.pomodoro_state_key])} />

<br />

            rounds: { clock_settings.rounds  }    <br />              
            round_duration: { clock_settings.round_duration }<br />
            timeLeft: { clock_settings.roundTimeLeft } <br />
            state: { clock_settings.pomodoro_state_key}{ clock_settings.pomodoro_state_flow[clock_settings.pomodoro_state_key] }
            </div>

    )
   
}

export default Pomodoro;