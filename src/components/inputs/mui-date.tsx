import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from 'dayjs';


interface Props {
    handleDateChange: (date: any, from: string) => void
    from: string
    label?: string
    value: string
    isDisabled?: boolean
    minDate?: string
    maxDate?: string
    defaultValue?: string
}

export default function MuiDate({
    handleDateChange,
    label,
    from,
    value,
    minDate,
    maxDate,
    defaultValue
}: Props) {
    const dateMapper = {
        Jan: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12',
    }

    const parseDate = (value) => {
        const dateArray = value.split('-')
        const newDate = `${dateArray[1]}-${dateArray[0]}-${dateArray[2]}`

        return dayjs(newDate)
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

    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    sx={{
                        width: "100%",
                        marginBottom: "10px",
                    }}
                    onChange={onChange}
                    format="DD-MM-YYYY"
                    label={label}
                    value={dayjs(value)}
                    defaultValue={defaultValue && parseDate(defaultValue)}
                    minDate={minDate && parseDate(minDate)}
                    maxDate={maxDate && parseDate(maxDate)}
                />
            </LocalizationProvider>
        </div>
    );
}