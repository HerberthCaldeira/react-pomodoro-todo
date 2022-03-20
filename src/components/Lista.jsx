const Lista = (props) => {

    const handleClick = (todo_id) => {
        let todos = [...props.lista];
        let index = props.lista.findIndex((item) =>{
            return item.id === todo_id;
        });
        todos[index].status = !todos[index].status;
        props.setListaProps([...todos])
    }

    const handleRemove = (todo_id) => {
        let todos = [...props.lista];
        let newTodos = todos.filter(( item ) => {
            return item.id !== todo_id;
        });

        props.setListaProps([...newTodos])

    }

    const lista = props.lista.map((item, index)=> {
        return ( 
            <div className="flex" key={item.id}>
                <div className={` 
                flex-grow
                mt-4 py-2
               
                ${ item.status? 'text-green-400' : 'text-red-400' }
                ${ item.status? '' : 'line-through' } 
                hover:text-blue-300
                `}               
                onClick={ () =>  handleClick(item.id)  }
                >
                    
                    {item.todo}             
            
                    
                
                </div>

                <div className="mt-4 py-2">
                    <button className="
                    mt-2 px-6 py-2.5 text-xs leading-tight
                    uppercase text-white font-bold rounded 
                    shadow-md bg-red-500 hover:bg-red-700"
                    onClick={ () =>  handleRemove(item.id)  }                    
                    > 
                        Excluir
                    </button>
                </div>
            </div>
        
        );
    });

    return (
        <div className="
            m-2
            px-4
            bg-white        
            shadow-md
        ">
            <div className="">
                {lista}
            </div>
        </div>
    )

}

export default Lista;