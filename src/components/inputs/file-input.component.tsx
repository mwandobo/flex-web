import {Input} from "@mui/material";
import React from "react";

interface FileFieldProps {
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

const FileInputComponent = ({
                                onChange,
                                label,
                                from
                            }: FileFieldProps) => {
    return (
        <div className="mb-5 w-full">
            {label && <label className="block text-gray-700 mb-2">{label}</label>}
            <Input
                type="file"
                onChange={(event: any) => onChange(event, from)}
                className="w-full border-gray-600"
            />
        </div>
    );
}

export default FileInputComponent;
