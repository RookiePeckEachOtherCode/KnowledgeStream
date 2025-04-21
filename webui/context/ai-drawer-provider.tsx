"use client";

import {createContext, ReactNode, useContext, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBots} from "@fortawesome/free-brands-svg-icons";
import {IconButton} from "@mui/material";
import {IconButton as LibraryIconButton} from "../app/components/icon-button";
import {
    faDownLeftAndUpRightToCenter,
    faUpRightAndDownLeftFromCenter,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";

type AIDrawerContextType = {
    handleAIDrawerOpenState: () => void;
    handleAiDrawerFullState: () => void;
    isOpen: boolean;
    isFullScreen: boolean;
};
const AIDrawerContext = createContext<AIDrawerContextType | undefined>(
    undefined
);

type ProviderProps = {
    children: ReactNode;
};

export function AIDrawerProvider({children}: ProviderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);
    const [buttonHover, setButtonHover] = useState(false);
    const [currentWeb, setCurrentWeb] = useState("https://www.doubao.com/");

    const WEB_PRESETS = [
        {name: "豆包AI", url: "https://www.doubao.com/"},
        {name: "硅基流动", url: "https://account.siliconflow.cn"},
        {name: "Gemini", url: "https://gemini.google.com/"},
        {name: "Claude", url: "https://claude.ai/"},
    ];

    const handleAIDrawerOpenState = () => {
        setIsOpen(!isOpen);
        if (isOpen) {
            setFullScreen(false);
        }
    };

    const handleAiDrawerFullState = () => {
        setFullScreen(!fullScreen);
    };

    const baseDrawerClasses = `fixed flex flex-col p-6 space-y-6 bg-surface-container transition-all duration-300`;

    const visibilityClasses = isOpen
        ? `translate-x-0 opacity-100`
        : `translate-x-full opacity-0 z-[-1] pointer-events-none`;


    const layoutClasses = fullScreen
        ? `w-full h-full top-0 left-0 z-50`
        : `w-1/2 h-2/3 right-12 top-1/5 rounded-2xl shadow-2xl border border-surface-dim z-40`;


    return (
        <AIDrawerContext.Provider
            value={{
                handleAIDrawerOpenState,
                handleAiDrawerFullState,
                isOpen,
                isFullScreen: fullScreen,
            }}
        >
            <div className={`w-full h-full flex relative flex-col overflow-hidden`}>
                {children}
                <div className={`${baseDrawerClasses} ${layoutClasses} ${visibilityClasses}`}>
                    <div className="w-full flex justify-between items-center flex-shrink-0">
                        <select
                            value={currentWeb}
                            onChange={(e) => setCurrentWeb(e.target.value)}
                            className="bg-transparent border-b-2 border-primary focus:outline-none text-on-surface-variant">
                            {WEB_PRESETS.map((preset) => (
                                <option key={preset.url} value={preset.url} className="bg-surface text-on-surface">
                                    {preset.name}
                                </option>
                            ))}
                        </select>
                        <div className="flex gap-2 ">
                            <IconButton
                                onClick={handleAiDrawerFullState}
                                className="p-2 hover:bg-primary/20 rounded-full text-on-background"
                                aria-label={fullScreen ? "Exit full screen" : "Enter full screen"}
                            >
                                <FontAwesomeIcon
                                    className={`text-on-background`}
                                    icon={
                                        fullScreen
                                            ? faDownLeftAndUpRightToCenter
                                            : faUpRightAndDownLeftFromCenter
                                    }
                                />
                            </IconButton>
                            <IconButton
                                onClick={handleAIDrawerOpenState}
                                className="p-2 hover:bg-primary/20 rounded-full text-on-surface-variant"
                                aria-label="Close AI drawer"
                            >
                                <FontAwesomeIcon className={`text-on-background`} icon={faXmark}/>
                            </IconButton>
                        </div>
                    </div>
                    <div className="w-full h-full flex-grow overflow-hidden">
                        <iframe
                            src={currentWeb}
                            className={`w-full h-full border-0`}
                            title="AI Assistant"
                            allowFullScreen={true}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                    </div>
                </div>
                <div
                    onMouseEnter={() => setButtonHover(true)}
                    onMouseLeave={() => setButtonHover(false)}
                    className={`bottom-8 fixed right-3 flex flex-col items-center justify-center space-y-2 z-30 ${isOpen ? 'pointer-events-none' : ''}`}
                >
                    {!isOpen && (
                        <LibraryIconButton
                            text={``}
                            onClick={handleAIDrawerOpenState}
                            className={`h-12 w-12 rounded-full bg-amber-200 shadow-lg`}
                            aria-label="Open AI drawer"
                        >
                            <FontAwesomeIcon icon={faBots}/>
                        </LibraryIconButton>
                    )}
                    {!isOpen && (
                        <div
                            className={`${
                                buttonHover ? `opacity-100` : `opacity-0`
                            } transition-opacity duration-200 text-on-background text-center bg-primary-container p-1 rounded-lg text-xs px-2`}
                        >
                            打开AI聊天
                        </div>
                    )}
                </div>
            </div>
        </AIDrawerContext.Provider>
    );
}


export const useAIDrawer = () => {
    const context = useContext(AIDrawerContext);
    if (!context) {
        throw new Error("useAIDrawer must be used within an AIDrawerProvider");
    }
    return context;
};