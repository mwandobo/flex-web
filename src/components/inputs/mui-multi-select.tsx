import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import {useEffect, useState} from "react";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import {get} from "@/utils/api";
import CreateOptionsForselectHelper from "@/utils/actions/createOptionsForSelect.helper";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
];

interface Props {
    optionsUrlData: string
    optionDataKey: string
    from: string
    label?: string
    placeholder?: string
    value: any;
    handleChange: (event: any, from?: string, control_for?: string) => void
}

export default function MuiMultiSelectSelect({
                                                 optionsUrlData,
                                                 optionDataKey,
                                                 handleChange,
                                                 from,
                                                 placeholder,
                                                 label,
                                                 value
                                             }: Props) {
    const [selected, setSelected] = React.useState<number[]>([]); // Store IDs

    const [options, setOptions] = useState<any[]>([]);
    const token = getValueFromLocalStorage('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await get(optionsUrlData, token);
                if (res && res.status === 200) {
                    const payload = CreateOptionsForselectHelper(res.data.data, optionDataKey);
                    setOptions(payload);
                }
            } catch (error) {
                console.error("API Error:", error);
            }
        };

        fetchData();
    }, [optionDataKey, optionsUrlData, token]);

    const onChange = (event: SelectChangeEvent<typeof selected>) => {
        const {
            target: {value},
        } = event;
        setSelected(
            typeof value === 'string' ? value.split(',').map(Number) : value
        ); // Ensure the value is an array of IDs (numbers)

        return handleChange(event, from)
    };

    return (
        <div>
            <FormControl sx={{width: '100%', marginBottom: "5px"}}>
                <InputLabel sx={{ fontWeight: 500, color: 'black'}} id="demo-multiple-checkbox-label">{label}</InputLabel>
                <Select
                    className={'w-full'}
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={selected} // This contains IDs (option.value)
                    onChange={onChange}
                    placeholder={placeholder}
                    input={<OutlinedInput label={label}/>}
                    renderValue={(selected) =>
                        selected
                            .map(id => options.find(option => option.value === id)?.label) // Convert ID back to name for display
                            .join(', ')
                    }
                    MenuProps={MenuProps}
                >
                    {options?.length > 0 && options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            <Checkbox checked={selected.includes(option.value)}/> {/* Compare by value (ID) */}
                            <ListItemText primary={option.label}/> {/* Display the name */}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

