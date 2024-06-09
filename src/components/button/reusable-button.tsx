import { Button, CircularProgress, } from "@mui/material"
import { ReactNode } from "react"

interface Props {
    name?: string,
    onClick?: () => void
    children?: ReactNode
    bg_color?: string
    text_color?: string
    hover?: string
    type?: "button" | "submit" | "reset"
    variant?: "contained" | "text" | "outlined" | undefined
    isDisabled?: boolean
    isClickable?: boolean
    isEndIcon?: boolean
    width?: string
    _styles?: any
}

export function ReusableButton({
    name,
    onClick,
    children,
    bg_color = 'gray',
    text_color = 'white',
    hover = 'black',
    variant = 'contained',
    isDisabled,
    type = 'button',
    isClickable = true,
    isEndIcon,
    width,
    _styles,
}: Props) {
    return (

        <button type={type} className={`bg-${bg_color}-500 text-white text-xs hover:bg-gray-900 active:bg-gray-800`} onClick={onClick}>
            {isDisabled ? <CircularProgress size={20} /> :
                <div className="flex gap-1 px-1 h-5 items-center">
                    {children}
                    {name}
                </div>
            }
        </button >
    )

}




