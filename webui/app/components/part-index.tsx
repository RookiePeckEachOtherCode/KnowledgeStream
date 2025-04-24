import {useState, useEffect} from "react";
import {IconButton} from "@/app/components/icon-button";

interface partIndexProps {
    currentPage: number,
    handleIndex: (index: number) => void,
    isNoNextPage?: boolean
}

export function PartIndex({
                              currentPage,
                              handleIndex,
                              isNoNextPage,
                          }: partIndexProps) {
    const [index, setIndex] = useState(currentPage)

    // 同步父组件当前页码变化
    useEffect(() => {
        setIndex(currentPage)
    }, [currentPage])

    const indexChange = () => {
        handleIndex(index)
    }

    return (
        <div
            className="w-full flex flex-row justify-between items-center p-4 ">
            <div className="flex items-center space-x-3">
                <span className="text-on-backgournd font-medium">当前目录:</span>
                <input
                    type="number"
                    value={index}
                    onChange={(e) => setIndex(Math.max(1, parseInt(e.target.value) || 1))}
                    onKeyDown={(e) => e.key === "Enter" && indexChange()}
                    className="w-20 px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                    min="1"
                />
            </div>

            <div className="flex space-x-2">
                <IconButton
                    text="上一页"
                    onClick={() => {
                        const newIndex = Math.max(1, index - 1)
                        handleIndex(newIndex)
                        setIndex(newIndex)
                    }}
                    className="bg-primary-container text-white"
                    disable={index === 1}
                />
                <IconButton
                    text="下一页"
                    onClick={() => {
                        const newIndex = index + 1
                        handleIndex(newIndex)
                        setIndex(newIndex)
                    }}
                    className="bg-tertiary-container text-white"
                    disable={isNoNextPage}
                />
            </div>
        </div>
    )
}