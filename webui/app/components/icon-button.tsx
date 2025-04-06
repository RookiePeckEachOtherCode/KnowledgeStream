import React from "react";

interface IconButtonProps {
    children?: React.ReactNode,
    text: string,
    onClick: () => void,
    className: string,
    shadow?: boolean
}

export function IconButton({
                               children,
                               text,
                               onClick,
                               className,
                               shadow = false
                           }: IconButtonProps) {

    return (
        <button
            className={` ${className}    rounded-2xl ${shadow && `shadow-2xl`}
            duration-150 items-center flex flex-row justify-center text-center transition-all p-3
             hover:scale-110 hover:cursor-pointer`}
            onClick={onClick}
        >
            {children ? children : ``}
            <span>
                {text}
            </span>
        </button>

    )


}