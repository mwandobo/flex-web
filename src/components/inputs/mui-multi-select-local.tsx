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
    isSmall?: boolean
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
                                                 isSmall,
                                                 value
                                             }: Props) {
    const [selected, setSelected] = React.useState<number[]>([]); // Default to [1] if value is empty

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
        return (
            <div>
                <FormControl
                    sx={{
                        width: "100%",
                        marginBottom: "5px",
                        "& .MuiOutlinedInput-root": isSmall
                            ? { height: "35px", fontSize: "12px", padding: "6px" }
                            : {},
                        "& .MuiInputLabel-root": isSmall
                            ? { fontSize: "12px" }
                            : {},
                        "& .MuiSvgIcon-root": isSmall
                            ? { fontSize: "18px" }
                            : {},
                    }}
                >
                    {passed_label && (
                        <InputLabel
                            sx={{ fontWeight: 500, color: "black", fontSize: isSmall ? "12px" : "inherit" }}
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
                        value={selected} // This contains IDs (option.value)
                        onChange={onChange}
                        placeholder={placeholder}
                        input={<OutlinedInput label={passed_label} />}
                        renderValue={(selected) => (
                            <span style={{ fontSize: isSmall ? "12px" : "16px" }}>
                            {selected
                                .map((id) => options.find((option) => option.value === id)?.label) // Convert ID back to name for display
                                .join(", ")}
                        </span>
                        )}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    "& .MuiMenuItem-root": {
                                        fontSize: isSmall ? "12px" : "16px", // ✅ Apply styles to dropdown items
                                        padding: isSmall ? "5px 10px" : "10px 20px",
                                    },
                                    maxHeight: isSmall ? 200 : 300, // Adjust dropdown height
                                },
                            },
                        }}
                        sx={{
                            "& .MuiSelect-select": { fontSize: isSmall ? "12px" : "16px" },
                        }}
                    >
                        {options?.length > 0 &&
                            options.map((option) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                    sx={{
                                        fontSize: isSmall ? "12px" : "16px", // ✅ Ensures dropdown options are smaller when isSmall
                                        padding: isSmall ? "5px 10px" : "10px 20px",
                                    }}
                                >
                                    <Checkbox checked={selected.includes(option.value)} />
                                    <ListItemText primary={option.label} />
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </div>
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
}