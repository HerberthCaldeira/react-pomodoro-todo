import { useEffect, useReducer } from 'react'
import ModalConfirm from './ModalConfirm'

const initialStates = {
    todo: '',
    error: { 
        isValid: null,
        title: '',
        message: ''
    }
}

const todoReducerFn = (state, action) => {

    if (action.type === 'RESET'){
        return { ...initialStates }
    } 

    if (action.type === 'HANDLE_CHANGE'){
        return {...state, todo: action.value}
    } 

    if (action.type === 'CHECK_VALIDATION'){
        
        return { 
            ...state,
            error:
            {
                isValid: action.value.trim().length === 0 ? false : true ,
                title: action.value.trim().length === 0 ? 'Error' : '',
                message: action.value.trim().length === 0 ? 'Empty field': '',
            }
        }
                  
    } 

}

const Form = (props) => {

    const [todoReducer, todoReducerDispatch] = useReducer(todoReducerFn, initialStates);
    const { isValid } = todoReducer.error

    useEffect(() => {  
        if(isValid){          
            props.setListaProps(
                 [ 
                    ...props.lista,
                    {
                        id: Math.random(),
                        todo: todoReducer.todo,
                        status: true
                    }
                ]
        )  
            todoReducerDispatch({type: 'RESET'})
                        
        }

    }, [isValid, props.setListaProps, todoReducerDispatch])


    useEffect(() =>{   
        localStorage.setItem('lista', JSON.stringify([...props.lista]))
    },[props.lista])
  

    const handleChange = (e) => {  
        todoReducerDispatch({ type:'HANDLE_CHANGE', value: e.target.value});
    }

    const handleSubmit = (e) => {      
        e.preventDefault();
        todoReducerDispatch({type:'CHECK_VALIDATION', value: todoReducer.todo })      
    }

    const onConfirm = () =>{   
        todoReducerDispatch({type: 'RESET'})
    }

    return (
        <div>
            {
                todoReducer.error.isValid == false &&
                 <ModalConfirm title={todoReducer.error.title} message={todoReducer.error.message} onConfirm={ onConfirm }/> 
            }

            <div className="m-2 p-6 shadow-lg bg-white">
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-6">
                        <label className="
                    form-label inline-block
                    mb-2
                    text-gray-700" htmlFor="">Tarefa</label>
                        <input className="
                            form-control
                            block
                            w-full              
                            px-3 py-1.5
                            border border-solid border-gray-300 rounded"
                            type="text"
                            name="todo"
                            value={todoReducer.todo}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                        <button className=" 
                    mt-2
                    px-6 py-2.5 text-xs
                    leading-tight uppercase text-white font-bold
                    rounded
                    shadow-md bg-blue-500 
                    hover:bg-blue-700" type="submit">Adicionar</button>
                    </div>
                </form>
            </div>
        </div>
    )

}

export default Form;