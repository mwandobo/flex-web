import React, {useEffect, useState} from 'react';
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from '@mui/material';
import {get} from "@/utils/api";
import CreateOptionsForselectHelper from "@/utils/actions/createOptionsForSelect.helper";

interface Props {
    handleChange: (event: any, from: string, control_for: string) => void
    rows?: number;
    placeholder?: string;
    label?: string;
    labelStyle?: string;
    from: string;
    isDisabled?: boolean;
    isSmall?: boolean;
    isRequired?: boolean;
    optionsUrlData?: any;
    optionDataKey?: string;
    value: any;
    error?: string
    control?: string
    control_id?: string
    control_for?: string
}

const MuiSelectLocal = ({
                            handleChange,
                            optionsUrlData,
                            labelStyle,
                            optionDataKey,
                            isSmall,
                            from,
                            isDisabled,
                            isRequired,
                            placeholder = 'Enter your text here...',
                            value = '-1',
                            error,
                            label = '',
                            control,
                            control_for
                        }: Props) => {


    const onChange = (event: SelectChangeEvent) => {
        return handleChange(event, from, control_for)
    };


    const body = (passed_label?: string) => {
        return (
            <>
                {error && <p className="text-red-400 mb-2" style={{ fontSize: "12px" }}>{error}</p>}

                <FormControl
                    fullWidth
                    sx={{
                        "& .MuiOutlinedInput-root": isSmall
                            ? { height: "35px", fontSize: "12px", padding: "6px" }
                            : {},
                        "& .MuiInputLabel-root": isSmall
                            ? { fontSize: "12px" }
                            : { fontSize: "16px" },
                        "& .MuiSvgIcon-root": isSmall
                            ? { fontSize: "18px" }
                            : {},
                        "& .MuiMenuItem-root": isSmall
                            ? { fontSize: "12px" }
                            : { fontSize: "16px" },
                    }}
                >
                    {labelStyle !== "row" && (
                        <InputLabel
                            id={`${passed_label}-select-label`}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "-5px",
                                color: "black",
                                fontSize: isSmall ? "12px" : "16px",
                            }}
                        >
                            {isRequired ? (
                                <span style={{ display: "flex", alignItems: "center" }}>
                                {passed_label}{" "}
                                    <span style={{ color: "red", marginLeft: "4px", fontSize: isSmall ? "12px" : "16px" }}>
                                    *
                                </span>
                            </span>
                            ) : (
                                passed_label
                            )}
                        </InputLabel>
                    )}

                    <Select
                        labelId={`${passed_label}-select-label`}
                        id={`${passed_label}-select`}
                        value={value}
                        label={passed_label && passed_label}
                        onChange={onChange}
                        disabled={isDisabled}
                        required={isRequired}
                        size="medium"
                        sx={{
                            marginBottom: "20px",
                            height: isSmall ? "35px" : "auto",
                            fontSize: isSmall ? "12px" : "16px",
                        }}
                    >
                        {optionsUrlData &&
                            optionsUrlData.length > 0 &&
                            optionsUrlData.map((option: any) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                    sx={{ fontSize: isSmall ? "12px" : "16px" }}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </>
        );
    };

    return (
        <div className="w-full">
            {labelStyle === "row" ? (
                <div className="flex w-full justify-center items-center gap-2">
                    <p className="min-w-[100px] max-w-[150px] text-right text-xs font-medium text-gray-700 truncate flex flex-col justify-center">
                        {label}
                    </p>
                    <div className="flex-1">
                        {body()}
                    </div>
                </div>
            ) : (
                <div>
                    {body(label)}
                </div>
            )}
        </div>
    );
};

export default MuiSelectLocal;
