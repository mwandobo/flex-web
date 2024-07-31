import React, { useEffect, useState } from 'react';
import { Select, FormControl, InputLabel, MenuItem, SelectChangeEvent } from '@mui/material';
import { get } from '@/utils/api';
import CreateOptionsForselectHelper from '@/utils/actions/createOptionsForSelect.helper';
import { getValueFromLocalStorage } from '@/utils/actions/local-starage';

interface Props {
  handleChange: (event: any, from: string, control_for: string) => void
  rows?: number;
  placeholder?: string;
  label?: string;
  from: string;
  isDisabled?: boolean;
  optionsUrlData?: string;
  optionDataKey?: string;
  value: any;
  error?: string
  control?: string
  control_id?: string
  control_for?: string
}

const MuiSelect = ({
  handleChange,
  optionsUrlData,
  optionDataKey,
  from,
  isDisabled,
  placeholder = 'Enter your text here...',
  value,
  error,
  label = '',
  control_for
}: Props) => {

  const onChange = (event: SelectChangeEvent) => {
    return handleChange(event, from, control_for)
  };

  const [options, setOptions] = useState<any[]>([]);
  const token = getValueFromLocalStorage('token')

  useEffect(() => {
    const fetchData = async () => {
      const res = await get(optionsUrlData, token)

      if (res && res.status === 200) {
        const payload = CreateOptionsForselectHelper(res.data.data, optionDataKey)

        setOptions(payload)
      }
    };
    fetchData()
  }, [optionsUrlData]);

  return (
    <>
      <FormControl fullWidth>
        <InputLabel
          id={`${label}-select-label`}
          style={{
            display: 'flex',
            fontSize: '13px',
            justifyContent: 'center',
            marginTop: "-5px",
            color: 'black'
          }}
        >
          {`${label}`}
        </InputLabel>
        <Select
          labelId={`${label}-select-label`}
          id={`${label}-select`}
          value={value}
          label={label}
          onChange={onChange}
          disabled={isDisabled}
          size="small"
          style={{
            marginBottom: "20px"
          }}
        >
          {options && options.length > 0 &&
            options.map((option: any) => (
              < MenuItem
                key={option.value}
                value={option.value}
                style={{
                  fontSize: '13px'
                }}
              >
                {option.label}
              </MenuItem>
            ))}
        </Select>
      </FormControl >
      {error && <p className="text-red-700 p-3">{error}</p>
      }
    </>
  )
};

export default MuiSelect;
