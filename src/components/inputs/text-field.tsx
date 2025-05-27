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
    isRow?: boolean;
    isColumn?: boolean;
    isSmall?: boolean;
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
                                isRow = false,
                                isColumn = false,
                                isSmall = false,
                            }: TextFieldsProps) => {
    const labelStyles = {
        fontSize: isSmall ? "14px" : "16px",
        color: "black",
        display: "flex",
        alignItems: "center",
    };

    const inputStyles = {
        fontSize: isSmall ? "14px" : "16px",
        color: "black",
        padding: isSmall ? "6px 10px" : "10px 14px",
    };

    const renderCustomLabel = () => (
        <label
            className={`text-black ${isSmall ? "text-sm" : "text-base"} ${
                isRequired ? "after:content-['*'] after:ml-1 after:text-red-500" : ""
            }`}
        >
            {label}
        </label>
    );

    const wrapperClass = isRow
        ? "flex items-center gap-4 mb-4"
        : isColumn
            ? "flex flex-col mb-4"
            : "";

    return (
        <div className={wrapperClass || "mb-4"}>
            {(isRow || isColumn) && label && renderCustomLabel()}

            <div className="flex-1">
                {errorMessage && (
                    <p className="text-red-400 mb-1 text-xs">{errorMessage}</p>
                )}
                <TextField
                    label={
                        !(isRow || isColumn)
                            ? isRequired ? (
                                <span style={{ display: "flex", alignItems: "center" }}>
                                      {label}
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
                            : undefined
                    }
                    sx={{ width: "100%" }}
                    InputLabelProps={{ style: labelStyles }}
                    inputProps={{ style: inputStyles }}
                    size={isSmall ? "small" : "medium"}
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e, from)}
                    disabled={isDisabled}
                    type={type}
                />
            </div>
        </div>
    );
};

export default TextFieldComponent;
