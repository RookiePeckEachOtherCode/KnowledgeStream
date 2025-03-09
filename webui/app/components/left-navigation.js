import { useState } from "react";

export function LeftNavigation(props) {
    const { children, hidden} = props;
    return (
        <div className={`flex flex-col ${hidden?`w-0`:`w-1/16`} transition-all h-full items-center 
      bg-zinc-100 dark:bg-zinc-800 shadow-lg pt-4  border-r space-y-5 relative duration-300
      border-gray-200 dark:border-zinc-700`}>
                {!hidden&&children}
                
        </div>
    );
}

export function NavigationItem(props) {
    const { children, title, onClick, isFirst,isActive } = props;

    return (
        <button
            className={`group relative w-12 h-12 rounded-xl flex flex-col items-center justify-center
        transition-all duration-200 hover:w-14 mx-2
        ${isFirst ? "mt-4" : "mt-0"}
        ${isActive ?
                "bg-orange-100 dark:bg-zinc-700 scale-110" :
                "hover:bg-gray-100 dark:hover:bg-zinc-600"}
      `}
            onClick={() => {
                onClick?.();
            }}
        >
            {/* 图标容器 */}
            <div className={`transform transition-all ${
                isActive ? "scale-125 -translate-y-1" : "group-hover:scale-110"
            }`}>
                {children}
            </div>

            {/* 浮动标签 */}
            <div className={`absolute left-full ml-3 px-3 py-1.5 rounded-md shadow-md
        bg-white dark:bg-zinc-700 text-sm font-medium
        opacity-0 group-hover:opacity-100 transition-opacity
        pointer-events-none whitespace-nowrap`}>
                {title}
            </div>

            {/* 激活指示器 */}
            {isActive && (
                <div className="absolute -left-1 top-1/2 w-1 h-6 bg-orange-500 
          rounded-full -translate-y-1/2" />
            )}
        </button>
    );
}