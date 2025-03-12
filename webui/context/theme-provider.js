"use client"

import {createContext, useContext, useEffect, useState} from "react";

const ThemeContext=createContext(undefined)

export const ThemeProvider=({children})=>{
    const [theme, setTheme] = useState("dark")

    useEffect(() => {
        const savedTheme=localStorage.getItem("theme");
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');

        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
        setTheme(initialTheme)
    }, []);
    
    const toggleTheme=()=>{
        setTheme(prev=>{
            const newTheme=prev==='light' ? 'dark' : 'light';
            localStorage.setItem('theme',newTheme)
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
            return newTheme;
            
        })
    }
    
    return(
        <ThemeContext.Provider value={{theme,toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme=()=>{
    const context=useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}