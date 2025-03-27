import {Button, CircularProgress,} from "@mui/material"
import {ReactNode} from "react"

interface Props {
    name?: string,
    onClick?: () => void
    children?: ReactNode
    bg_color?: string
    text_color?: string
    hover?: string
    hover_text?: string
    type?: "button" | "submit" | "reset"
    variant?: "contained" | "text" | "outlined" | undefined
    isDisabled?: boolean
    disabled?: boolean
    isClickable?: boolean
    isEndIcon?: boolean
    width?: string
    rounded?: string
    padding?: string
    border?: string
    shadow?: string
    isSmallButton?: boolean

}

export function ReusableButton({
                                   name,
                                   onClick,
                                   children,
                                   bg_color = 'bg-gray-500',
                                   text_color = 'text-white',
                                   hover = 'hover:bg-gray-900',
                                   hover_text = 'white',
                                   variant = 'contained',
                                   isDisabled,
                                   type = 'button',
                                   isClickable = true,
                                   disabled=false,
                                   isEndIcon,
                                   width,
                                   rounded,
                                   shadow,
                                   padding,
                                   border,
                                   isSmallButton,

                               }: Props) {
    return (
        <button
            type={type}
            className={`${bg_color} ${text_color} ${border} text-xs ${!disabled && hover}  ${shadow}  ${padding && padding} ${rounded && `rounded-${rounded}`}`}
            onClick={onClick}
            style={{
                fontSize: isSmallButton && "8px"
            }}
            disabled={disabled}
        >
            {isDisabled ? <CircularProgress size={20}/> :
                <div className={`flex gap-1 ${text_color} ${!disabled && hover_text} px-1 h-5 items-center`}>
                    {isEndIcon ?
                        <>
                            {name}
                            {children}

                        </> :
                        <>
                            {children}
                            {name}
                        </>
                    }

                </div>
            }
        </button>
    )
}




