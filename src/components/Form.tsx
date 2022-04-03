import React, { useEffect, useReducer } from 'react'
import ModalConfirm from './ModalConfirm'
import { IListaProps } from '../App'

interface IInitialStates {
    todo: string;
    error: { 
        isValid: null | boolean;
        title: string;
        message: string;
    }
}

type IAction = | {type: 'RESET'} | {type: 'HANDLE_CHANGE', value: string} | {type: 'CHECK_VALIDATION', value: string}

const initialStates:IInitialStates = {
    todo: '',
    error: { 
        isValid: null,
        title: '',
        message: ''
    }
}

const todoReducerFn = (state: IInitialStates, action: IAction): IInitialStates => {

    switch(action.type){
        case 'RESET':
            return { ...initialStates }

        case 'HANDLE_CHANGE':
            return {...state, todo: action.value}
        case 'CHECK_VALIDATION':
            return { 
                ...state,
                error:
                {
                    isValid: action.value.trim().length === 0 ? false : true ,
                    title: action.value.trim().length === 0 ? 'Error' : '',
                    message: action.value.trim().length === 0 ? 'Empty field': '',
                }
            }
        default:
            return initialStates;


    }



}

const Form = (props: IListaProps) => {

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
  

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {  
        todoReducerDispatch({ type:'HANDLE_CHANGE', value: e.target.value});
    }

    const handleSubmit = (e: React.FormEvent) => {      
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