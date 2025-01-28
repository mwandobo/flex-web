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
  optionDataKey,
  from,
  isDisabled,
                          isRequired,
  placeholder = 'Enter your text here...',
  value,
  error,
  label = '',
  control,
  control_for
}: Props) => {

  const onChange = (event: SelectChangeEvent) => {
    return handleChange(event, from, control_for)
  };

  return (
    <>
      {error && <p className="text-red-400 mb-2" style={{fontSize: '12px'}}>{error}</p>
      }
      <FormControl fullWidth>
        <InputLabel
          id={`${label}-select-label`}
          style={{
            display: 'flex',
            fontSize: '16px',
            justifyContent: 'center',
            marginTop: "-5px",
            color: 'black'
          }}
        >
          {isRequired ? (
              <span style={{ display: "flex", alignItems: "center" }}>
              {label}{" "}
                <span
                    style={{
                      color: "red",
                      marginLeft: "4px",
                      fontSize: "16px",
                    }}
                >
                *
              </span>
            </span>
          ) : (
              label
          )}        </InputLabel>
        <Select
          labelId={`${label}-select-label`}
          id={`${label}-select`}
          value={value}
          label={label}
          onChange={onChange}
          disabled={isDisabled}
          required={isRequired}
          size="medium"
          style={{
            marginBottom: "20px"
          }}
        >
          {optionsUrlData && optionsUrlData.length > 0 &&
              optionsUrlData.map((option: any) => (
              < MenuItem
                key={option.value}
                value={option.value}
                style={{
                  fontSize: '16px'
                }}
              >
                {option.label}
              </MenuItem>
            ))}
        </Select>
      </FormControl >

    </>
  )
};

export default MuiSelectLocal;
