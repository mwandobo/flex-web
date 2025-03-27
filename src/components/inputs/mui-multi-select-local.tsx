import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

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

interface Props {
    options: { label: string, value: number }[]
    from: string
    label?: string
    labelStyle?: string
    placeholder?: string
    value: any;
    handleChange: (event: any, from?: string, control_for?: string) => void
}

export default function MuiMultiSelectLocal({
                                                options,
                                                 handleChange,
                                                 from,
                                                 placeholder,
                                                labelStyle,
                                                 label,
                                                 value
                                             }: Props) {
    const [selected, setSelected] = React.useState<number[]>([]); // Default to [1] if value is empty

    console.log('value', value)
    React.useEffect(() => {
        if (value?.length) {
            setSelected(value); // Update state when `value` prop changes
        } else {
            setSelected([]); // Default to ID 1
        }
    }, [value]);



    const onChange = (event: SelectChangeEvent<typeof selected>) => {
        const {
            target: {value},
        } = event;
        setSelected(
            typeof value === 'string' ? value.split(',').map(Number) : value
        ); // Ensure the value is an array of IDs (numbers)

        return handleChange(event, from)
    };


    const body = (passed_label?: string) => {
        return <div>
            <FormControl sx={{width: '100%', marginBottom: "5px"}}>
                {passed_label &&
                    <InputLabel sx={{fontWeight: 500, color: 'black'}}
                                id="demo-multiple-checkbox-label">{passed_label}</InputLabel>
                }

                <Select
                    className={'w-full'}
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={selected} // This contains IDs (option.value)
                    onChange={onChange}
                    placeholder={placeholder}
                    input={<OutlinedInput label={passed_label}/>}
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
    }

    return (
        <div>
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