
import { Box, CircularProgress } from '@mui/material';
interface Props {
    size?: number
}

const MuiCIrcleSpinnerComponent = ({
    size = 80
}: Props) => {
    return (
        <Box className='h-screen flex flex-col justify-center items-center bg-gray-50'>
            <CircularProgress color="primary" className='' size={size} thickness={2} />
        </Box >
    );
}

export default MuiCIrcleSpinnerComponent