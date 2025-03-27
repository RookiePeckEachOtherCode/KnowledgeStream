"use client"

import { createContext, useContext, useState, useCallback } from "react";

const ModalContext = createContext(undefined)

export const ModalProvider = ({ children }) => {
    const [formChildren, setFormChildren] = useState(null)
    const [isShow, setIsShow] = useState(false)

    const toggleShowModal = useCallback((shouldShow) => {
        setIsShow(shouldShow)
    }, [])

    const setForm = useCallback((component) => {
        setFormChildren(component)
    }, [])
    
    return (
        <ModalContext.Provider value={{ isShow, toggleShowModal, setForm }}>
            {/* 主内容 */}
            {children}

            {/* 遮罩层 */}
                <div
                    className={`fixed inset-0 h-screen w-screen  ${isShow?`z-[999] opacity-100 `:`-z-10 opacity-0`} transition-all flex items-center justify-center bg-surface/50`}
                >
                    <div
                        className={`relative flex w-full h-full transition-all opacity-100 items-center justify-center z-[10000] ${isShow?`translate-x-0`:`translate-x-24 `}`}
                        onClick={() => {toggleShowModal(false);console.log("1111")}}
                    >
                        {formChildren}
                    </div>
                </div>
        </ModalContext.Provider>    
    )
}

export const useModal = () => {
    const context = useContext(ModalContext)
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider')
    }
    return context
}