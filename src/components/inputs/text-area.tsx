import React from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { InputLabel, makeStyles, styled } from '@mui/material';

interface Props {
    value?: string;
    onChange: (e: any, from: string) => void;
    rows?: number;
    placeholder?: string;
    label?: string;
    from: string;
    error?: string
}

const StyledTextareaAutosize = styled(TextareaAutosize)({
    '&::placeholder': {
        color: 'black',
        fontStyle: 'italic',
        fontSize: '13px'
    },
    "& .MuiInputLabel-root": {
        marginBottom: 80,
        color: 'black'

    },
});

const TextArea = ({
    value,
    onChange,
    from,
    rows = 4,
    label,
    error,
    placeholder = 'Enter your text here...',
}: Props) => {

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(event, from);
    };

    return (
        <>
            <InputLabel
                id={`${label}-select-label`}
                style={{
                    fontSize: '16px',
                    color: 'black'
                }}
            >
                {`${label}`}
            </InputLabel>
            <StyledTextareaAutosize
                value={value}
                onChange={handleChange}
                minRows={rows}
                placeholder={placeholder}
                aria-label={`${label}-select-label`}
                style={{
                    width: '100%',
                    border: '2px solid #d1d1d1',
                    borderRadius: '5px',
                    padding: '2px 10px',
                    color: 'black',
                    fontSize: '15px',
                    marginBottom: "10px"
                }}
            />
            {error && <p className="text-red-700 ps-3">{error}</p>}
        </>
    );
};

export default TextArea;
