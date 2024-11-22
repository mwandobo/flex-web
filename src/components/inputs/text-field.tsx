import { TextField } from "@mui/material";

interface TextFieldsProps {
    placeholder: string;
    isDisabled?: boolean;
    isRequired?: boolean;
    isError?: boolean;
    label?: string;
    value?: string;
    type?: string;
    from: string;
    errorMessage?: string;
    onChange: (e: any, from: string) => void;
}

const TextFieldComponent = ({
                                onChange,
                                placeholder,
                                isDisabled,
                                isRequired,
                                errorMessage,
                                label,
                                value,
                                type,
                                from,
                            }: TextFieldsProps) => {
    const labelStyles = {
        fontSize: "16px",
        color: "black",
        display: "flex",
        alignItems: "center",
    };

    const inputStyles = {
        fontSize: "16px",
        color: "black",
    };

    return (
        <div>
            {errorMessage && (
                <p
                    className={"text-red-400 mb-1"}
                    style={{ fontSize: "12px" }}
                >
                    {errorMessage}
                </p>
            )}
            <TextField
                label={
                    isRequired ? (
                        <span style={{ display: "flex", alignItems: "center" }}>
                            {label}{" "}
                            <span
                                style={{
                                    color: "red",
                                    marginLeft: "4px",
                                    fontSize: "16px",
                                }}
                            >
                                *
                            </span>
                        </span>
                    ) : (
                        label
                    )
                }
                sx={{
                    width: "100%",
                    marginBottom: "20px",
                }}
                InputLabelProps={{ style: labelStyles }}
                inputProps={{ style: inputStyles }}
                size="medium"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e, from)}
                disabled={isDisabled}
                type={type}
            />
        </div>
    );
};

export default TextFieldComponent;
