import React from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

export default function MuiRadioButtonsGroup({ label, options, from, onChange }) {
    return (
        <FormControl>
            <FormLabel id={`${name}-label`}>{label}</FormLabel>
            <RadioGroup
                row
                aria-labelledby={`${name}-label`}
                name={from}
                onChange={(e) => onChange(e, from)}
            >
                {options.map(option => (
                    <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                        disabled={option.disabled}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
}
