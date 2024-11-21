import { TextField } from "@mui/material"
import { useEffect } from "react"

interface TextFieldsProps {
    placeholder: string
    isDisabled?: boolean
    isRequired?: boolean
    isError?: boolean
    label?: string
    value?: string
    type?: string
    from: string
    errorMessage?: string
    onChange: (e: any, from: string) => void
}

const TextFieldComponent = ({
    onChange,
    placeholder,
    isDisabled,
    isRequired,
    isError,
    errorMessage,
    label,
    value,
    type,
    from
}: TextFieldsProps) => {
    const labelStyles = {
        fontSize: '16px',
        color: 'black',
    };

    const inputStyles = {
        fontSize: '16px',
        color: 'black',
    };

    return <TextField
        label={label}
        sx={{
            width: '100%',
            marginBottom: '20px',
        }}
        InputLabelProps={{ style: labelStyles }}
        inputProps={{ style: inputStyles }}
        size="medium"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e, from)}
        disabled={isDisabled}
        required={isRequired}
        error={isError}
        type={type}
        helperText={errorMessage}
    />
}

export default TextFieldComponent