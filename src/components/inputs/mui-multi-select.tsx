import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { useEffect, useState } from 'react';
import { getValueFromLocalStorage } from '@/utils/actions/local-starage';
import { get } from '@/utils/api';
import CreateOptionsForselectHelper from '@/utils/actions/createOptionsForSelect.helper';


interface Props {
    optionsUrlData: string;
    optionDataKey: string;
    from: string;
    isSmall?: boolean;
    label?: string;
    labelStyle?: string;
    placeholder?: string;
    value: any;
    handleChange: (event: any, from?: string, control_for?: string) => void;
}

export default function MuiMultiSelectSelect({
                                                 optionsUrlData,
                                                 optionDataKey,
                                                 handleChange,
                                                 from,
                                                 placeholder,
                                                 label,
                                                 labelStyle,
                                                 isSmall,
                                                 value,
                                             }: Props) {

    console.log('value', value)
    const [selected, setSelected] = useState<number[]>(value ?? []);
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
                console.error('API Error:', error);
            }
        };

        fetchData();
    }, [optionDataKey, optionsUrlData, token]);

    useEffect(() => {
        if (value?.length) {
            setSelected(value); // Populate from parent
        } else {
            setSelected([]);
        }
    }, [value]);

    const onChange = (event: SelectChangeEvent<typeof selected>) => {
        const {
            target: { value },
        } = event;
        setSelected(typeof value === 'string' ? value.split(',').map(Number) : value);
        return handleChange(event, from);
    };

    const body = (passed_label?: string) => {
        return (
            <FormControl
                sx={{
                    width: '100%',
                    marginBottom: '5px',
                    '& .MuiOutlinedInput-root': isSmall
                        ? { height: '35px', fontSize: '12px', padding: '6px' }
                        : {},
                    '& .MuiInputLabel-root': isSmall ? { fontSize: '12px' } : {},
                    '& .MuiSvgIcon-root': isSmall ? { fontSize: '18px' } : {},
                }}
            >
                {passed_label && (
                    <InputLabel
                        sx={{ fontWeight: 500, color: 'black', fontSize: isSmall ? '12px' : 'inherit' }}
                        id="demo-multiple-checkbox-label"
                    >
                        {passed_label}
                    </InputLabel>
                )}
                <Select
                    className="w-full"
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={selected}
                    onChange={onChange}
                    placeholder={placeholder}
                    input={<OutlinedInput label={passed_label} />}
                    renderValue={(selected) => (
                        <span style={{ fontSize: isSmall ? '12px' : '16px' }}>
                            {selected
                                .map((id) => options.find((option) => option.value === id)?.label)
                                .join(', ')}
                        </span>
                    )}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                '& .MuiMenuItem-root': {
                                    fontSize: isSmall ? '12px' : '16px',
                                    padding: isSmall ? '5px 10px' : '10px 20px',
                                },
                                maxHeight: isSmall ? 200 : 300,
                            },
                        },
                    }}
                    sx={{
                        '& .MuiSelect-select': { fontSize: isSmall ? '12px' : '16px' },
                    }}
                >
                    {options?.length > 0 &&
                        options.map((option) => (
                            <MenuItem
                                key={option.value}
                                value={option.value}
                                sx={{
                                    fontSize: isSmall ? '12px' : '16px',
                                    padding: isSmall ? '5px 10px' : '10px 20px',
                                }}
                            >
                                <Checkbox checked={selected.includes(option.value)} />
                                <ListItemText primary={option.label} />
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
        );
    };

    return (
        <div className="w-full">
            {labelStyle === 'row' ? (
                <div className="flex w-full justify-center items-center gap-2">
                    <p className="min-w-[100px] max-w-[150px] text-right text-xs font-medium text-gray-700 truncate flex flex-col justify-center">
                        {label}
                    </p>
                    <div className="flex-1">{body()}</div>
                </div>
            ) : (
                <div>{body(label)}</div>
            )}
        </div>
    );
}
