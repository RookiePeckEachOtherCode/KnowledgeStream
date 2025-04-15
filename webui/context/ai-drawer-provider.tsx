"use client"


import {createContext, ReactNode, useContext, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBots} from "@fortawesome/free-brands-svg-icons";
import {IconButton} from "@mui/material";
import {IconButton as LibraryIconButton} from "../app/components/icon-button"
import {faDownLeftAndUpRightToCenter, faUpRightAndDownLeftFromCenter, faXmark} from "@fortawesome/free-solid-svg-icons";

type  AIDrawerContextType = {
    handleAIDrawerOpenState: () => void
    handleAiDrawerFullState: () => void
}
const AIDrawerContext = createContext<AIDrawerContextType | undefined>(undefined)

type ProviderProps = {
    children: ReactNode;
};

export function AIDrawerProvider({children}: ProviderProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [fullScreen, setFullScreen] = useState(false)
    const [buttonHover, setButtonHover] = useState(false)
    const [currentWeb, setCurrentWeb] = useState("https://www.doubao.com/")

    // 预设网页列表
    const WEB_PRESETS = [
        {name: "豆包AI", url: "https://www.doubao.com/"},
        {name: "硅基流动", url: "https://account.siliconflow.cn"},
        {name: "Gemini", url: "https://gemini.google.com/"},
        {name: "Claude", url: "https://claude.ai/"},
    ]

    const handleAIDrawerOpenState = () => {
        setIsOpen(!isOpen)
    }

    const handleAiDrawerFullState = () => {
        setFullScreen(!fullScreen)
    }

    return (
        <AIDrawerContext.Provider value={{handleAIDrawerOpenState, handleAiDrawerFullState}}>
            <div className={`w-full h-full flex relative flex-col overflow-hidden`}>
                {children}
                <div
                    className={`${fullScreen ? `w-4/5` : `w-1/2`} rounded-2xl absolute ${
                        fullScreen ? `` : `right-12 top-1/5`
                    } space-y-6 p-6 flex flex-col ${
                        isOpen ? `translate-x-0 opacity-100` : `translate-x-1/2 opacity-0 z-[-1] `
                    } bg-secondary-fixed-dim transition-all duration-300 h-2/3`}>

                    {/* 顶部操作栏 */}
                    <div className="w-full flex justify-between items-center">
                        <select
                            value={currentWeb}
                            onChange={(e) => setCurrentWeb(e.target.value)}
                            className="bg-transparent border-b-2 border-primary focus:outline-none"
                        >
                            {WEB_PRESETS.map((preset) => (
                                <option key={preset.url} value={preset.url}>
                                    {preset.name}
                                </option>
                            ))}
                        </select>

                        <div className="flex gap-2">
                            <IconButton
                                onClick={handleAiDrawerFullState}
                                className="p-2 hover:bg-primary/20 rounded-full"
                            >
                                <FontAwesomeIcon
                                    icon={fullScreen ? faDownLeftAndUpRightToCenter : faUpRightAndDownLeftFromCenter}
                                />
                            </IconButton>
                            <IconButton
                                onClick={handleAIDrawerOpenState}
                                className="p-2 hover:bg-primary/20 rounded-full"
                            >
                                <FontAwesomeIcon icon={faXmark}/>
                            </IconButton>
                        </div>
                    </div>

                    <iframe
                        src={currentWeb}
                        className={`w-full h-full`}
                        allowFullScreen={true}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                </div>

                {/* 悬浮触发按钮 */}
                <div
                    onMouseEnter={() => setButtonHover(true)}
                    onMouseLeave={() => setButtonHover(false)}
                    className={`bottom-8 absolute right-3 flex flex-col items-center justify-center space-y-2`}>
                    <LibraryIconButton
                        text={``}
                        onClick={handleAIDrawerOpenState}
                        className={`h-12 w-12 rounded-full ${isOpen && `hidden`} bg-amber-200`}>
                        <FontAwesomeIcon icon={faBots}></FontAwesomeIcon>
                    </LibraryIconButton>
                    <div
                        className={`${
                            buttonHover ? `opacity-100` : `opacity-0`
                        } transition-all duration-200 text-on-background text-center bg-primary-container p-1 rounded-2xl`}>
                        打开AI聊天
                    </div>
                </div>
            </div>
        </AIDrawerContext.Provider>
    )
}

export const useAIDrawer = () => {
    const context = useContext(AIDrawerContext)
    if (!context) {
        throw new Error('useAIDrawer必须AIDrawerContext内使用');
    }
    return context;

}