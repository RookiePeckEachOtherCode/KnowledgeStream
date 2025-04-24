"use client"

import {createContext, ReactNode, useCallback, useContext, useState} from "react";


interface ModalContextType {
    isShow: boolean
    toggleShowModal: (shouldShow: boolean) => void
    setForm: (component: React.ReactNode) => void
}

export const ModalContext = createContext<ModalContextType>({
    isShow: false,
    toggleShowModal: () => {
    },
    setForm: () => {
    }
})

type ProviderProps = {
    children: ReactNode;
};
export const ModalProvider = ({children}: ProviderProps) => {
    const [formChildren, setFormChildren] = useState<React.ReactNode>(null)
    const [isShow, setIsShow] = useState(false)


    const toggleShowModal = useCallback((shouldShow: boolean) => {
        setIsShow(shouldShow)
    }, [])

    const setForm = useCallback((component: React.ReactNode) => {
        setFormChildren(component)
    }, [])

    return (
        <ModalContext.Provider value={{isShow, toggleShowModal, setForm}}>
            {/* 主内容 */}
            {children}

            {/* 遮罩层 */}
            <div
                className={`fixed inset-0 h-screen w-screen  ${isShow ? `z-[999] opacity-100 ` : `-z-10 opacity-0`} transition-all flex items-center justify-center bg-surface/50`}
            >
                <div
                    className={`relative flex w-full h-full transition-all opacity-100 items-center justify-center z-[10000] ${isShow ? `translate-x-0` : `translate-x-24 `}`}
                    onClick={() => {
                        toggleShowModal(false);
                    }}
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