import React from 'react';
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from '@mui/material';

interface Props {
    handleChange: (event: any, from: string, control_for: string) => void
    rows?: number;
    placeholder?: string;
    label?: string;
    labelStyle?: string;
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
                            labelStyle,
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

    // return (
    //     <>
    //         {error && <p className="text-red-400 mb-2" style={{fontSize: '12px'}}>{error}</p>
    //         }
    //         <FormControl fullWidth>
    //             <InputLabel
    //                 id={`${label}-select-label`}
    //                 style={{
    //                     display: 'flex',
    //                     fontSize: '16px',
    //                     justifyContent: 'center',
    //                     marginTop: "-5px",
    //                     color: 'black'
    //                 }}
    //             >
    //                 {isRequired ? (
    //                     <span style={{display: "flex", alignItems: "center"}}>
    //           {label}{" "}
    //                         <span
    //                             style={{
    //                                 color: "red",
    //                                 marginLeft: "4px",
    //                                 fontSize: "16px",
    //                             }}
    //                         >
    //             *
    //           </span>
    //         </span>
    //                 ) : (
    //                     label
    //                 )}        </InputLabel>
    //             <Select
    //                 labelId={`${label}-select-label`}
    //                 id={`${label}-select`}
    //                 value={value}
    //                 label={label}
    //                 onChange={onChange}
    //                 disabled={isDisabled}
    //                 required={isRequired}
    //                 size="medium"
    //                 style={{
    //                     marginBottom: "20px"
    //                 }}
    //             >
    //                 {optionsUrlData && optionsUrlData.length > 0 &&
    //                     optionsUrlData.map((option: any) => (
    //                         < MenuItem
    //                             key={option.value}
    //                             value={option.value}
    //                             style={{
    //                                 fontSize: '16px'
    //                             }}
    //                         >
    //                             {option.label}
    //                         </MenuItem>
    //                     ))}
    //             </Select>
    //         </FormControl>
    //
    //     </>
    // )


    const body = (passed_label?: string) => {
        return <>
            {error && <p className="text-red-400 mb-2" style={{fontSize: '12px'}}>{error}</p>
            }
            <FormControl fullWidth>

                {labelStyle !== 'row' && <InputLabel
                    id={`${passed_label}-select-label`}
                    style={{
                        display: 'flex',
                        fontSize: '16px',
                        justifyContent: 'center',
                        marginTop: "-5px",
                        color: 'black'
                    }}
                >
                    {isRequired ? (
                        <span style={{display: "flex", alignItems: "center"}}> {passed_label}{" "}
                            <span style={{color: "red", marginLeft: "4px", fontSize: "16px",}}> * </span>
                         </span>
                    ) : (passed_label)}
                </InputLabel>}
                <Select
                    labelId={`${passed_label}-select-label`}
                    id={`${passed_label}-select`}
                    value={value}
                    label={passed_label && passed_label}
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
            </FormControl>

        </>
    }

    return (
        <div className={'h-full'}>
            {labelStyle === 'row' ?
                <div className={'flex w-full items-center h-full'}>
                    <p className={'w-1/5 text-end pe-2 -mt-5 flex items-center'}>{label}</p>
                    <div className={'w-full bg-green'}>
                        {body()}
                    </div>
                </div> :
                <div>
                    {body(label)}
                </div>
            }
        </div>
    );
};

export default MuiSelectLocal;
