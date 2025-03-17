
interface DividerProps{
    className?:string
    vertical:boolean
}

export function Divider({
    className,
    vertical,
}:DividerProps){
    
    if(vertical){
        return(
            <div>
                
            </div>
        )
    }else{
        return <div className={`w-full mt-3 mb-3 h-[2px] ${className} bg-on-surface`}>
        </div>
    }
    
    
    
}