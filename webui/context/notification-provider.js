"use client"

import React, {createContext, useContext, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faInfo, faXmark} from "@fortawesome/free-solid-svg-icons";


const NotificationContext=createContext(undefined)

export function NotificationProvider({children}){
    
    var [message,setMessage] = useState(null);
    var [type, setType] = useState("info")
    
    const showNotification=(type,message)=>{
        setMessage(message)
        setType(type)
        setTimeout(()=>{setMessage(null),setType(null)},3000)
    }
    
    const typeStyles={
        success:"bg-surface-bright text-on-surface",
        error:"bg-error-container text-on-error-container",
        info:"bg-primary text-on-primary-container"
    }
    
    return (
        <NotificationContext.Provider value={{message,showNotification}}>
            {children}
            {<div
                className={`absolute ${message!==null?``:`-translate-y-24`} top-0 w-1/5 flex   right-0 m-3 h-16 bg-white shadow-2xl rounded-xl  
                duration-300 transition-all p-3 space-x-2 opacity-100 animate-slide-in text-on-background z-50 border-4 items-center text ${typeStyles[type]}`}>
                <span className=" text-xl">
                    {type === 'success' &&<FontAwesomeIcon icon={faCheck}/>}
                    {type === 'error' && <FontAwesomeIcon icon={faXmark}/>}
                    {type === 'info' && <FontAwesomeIcon icon={faInfo}/>}
                </span>
                <span className={`text-black`}>{message}</span>
            </div>}
        </NotificationContext.Provider>
        
    )
    
}

export const useNotification=()=>{
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification必须在NotificationProvider内使用');
    }
    return context;
    
}