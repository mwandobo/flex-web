import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

interface Props {
    children?: React.ReactNode,
    nodes: React.ReactNode[],
    columns: string[]
}

export default function MuiTab({
    children,
    nodes,
    columns
}: Props) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            {/* Tab Headers */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {
                        columns.map((column, index) => (
                            <Tab
                                key={index}
                                label={column}
                                {...a11yProps(index)} // Map index to each tab
                            />
                        ))
                    }
                </Tabs>
            </Box>

            {/* Tab Content (Rows) */}
            {
                columns.map((column, index) => (
                    <CustomTabPanel key={index} value={value} index={index}>
                        {nodes[index]} {/* Use the same index for nodes */}
                    </CustomTabPanel>
                ))
            }
        </Box>
    );
}
