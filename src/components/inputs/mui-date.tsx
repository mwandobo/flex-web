import React, {useEffect} from "react";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from 'dayjs';
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";

interface Props {
    handleDateChange: (date: any, from: string) => void
    from: string
    label?: string
    labelStyle?: string
    value: string
    isDisabled?: boolean
    isSmall?: boolean
    minDate?: string
    maxDate?: string
    defaultValue?: string
}


export default function MuiDate({
                                    handleDateChange,
                                    label,
                                    labelStyle,
                                    from,
                                    value,
                                    minDate,
                                    isSmall,
                                    maxDate,
                                    defaultValue
                                }: Props) {
    const parseDate = (value) => {
        return dayjs(value)
    }

    const onChange = (date: any) => {
        if (date && date.isValid()) {
            const formattedDate = date.format('YYYY-MM-DD');

            const event = {
                target: {
                    value: formattedDate
                }
            };
            handleDateChange(event, from);
        }
    }


    // useEffect(() => {
    // }, [value])value

    console.log('value', value )


    const body = (passed_label?: string) => {
        return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    sx={{
                        width: "100%",
                        marginBottom: "10px",
                        ...(isSmall && {
                            "& .MuiInputBase-root": { height: "35px" }, // Adjust input height
                            "& .MuiOutlinedInput-input": { fontSize: "12px", padding: "8px" }, // Reduce text size & padding
                            "& .MuiInputLabel-root": { fontSize: "12px" }, // Reduce label size
                            "& .MuiSvgIcon-root": { fontSize: "18px" }, // Reduce calendar icon size
                        })
                    }}
                    onChange={onChange}
                    format="DD-MM-YYYY"
                    label={passed_label}
                    value={value ? dayjs(value) : null}
                    defaultValue={defaultValue && parseDate(defaultValue)}
                    minDate={minDate && parseDate(minDate)}
                    maxDate={maxDate && parseDate(maxDate)}
                />
            </LocalizationProvider>
        );
    };



    return (
        <div className={'w-full'}>
            {labelStyle === 'row' ?
                <div className={'flex w-full items-center'}>
                    <p className={'w-1/5 text-end pe-2'}>{label}</p>
                    <div className={'w-full'}>
                        {body()}
                    </div>
                </div> :
                <div>
                    {body(label)}
                </div>
            }
        </div>
    );
}