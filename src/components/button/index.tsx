import { useEffect } from "react"

interface Props {
    text: string
    onClick?: () => void
    type?: "button" | "submit" | "reset" | undefined
    bg_color?: string
    text_color?: string
    text_size?: string
}

const Button = (
    {
        text,
        onClick,
        type = "button",
        bg_color,
        text_size,
        text_color
    }: Props) => {

    return (
        <button
            type={type}
            className={`bg-gray-500 text-white text-sm p-1`}
            style={{
                background: bg_color && bg_color,
                fontSize: text_size && text_size,
                color: text_color && text_color
            }}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default Button;