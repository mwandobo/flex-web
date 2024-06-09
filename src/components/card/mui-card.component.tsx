import { Card } from '@mui/material';
import React, { ReactNode } from 'react';

type Props = {
    children?: ReactNode;
    text?: string;
}

const MuiCardComponent = ({ children, text }: Props) => {
    return (
        <Card
            sx={{
                padding: '20px 10px',
                marginBottom: '10px',
                borderTop: '1px solid #E0E0E0',

            }}>
            {children}
        </Card>
    );
};

export default MuiCardComponent;