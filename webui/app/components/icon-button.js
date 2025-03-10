
export function IconButton(props){
    const {children,text,onClick,className}=props
    
    return(
        <button 
            className={` ${className}    rounded-2xl
            duration-150 items-center flex flex-row justify-center text-center transition-all p-3
             hover:scale-110 hover:cursor-pointer`}
            onClick={onClick}
        >
            {children}
            {text}
        </button>
        
    )
    
    
    
    
    
}