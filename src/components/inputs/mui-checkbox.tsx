import { FormControlLabel, Checkbox } from "@mui/material"
import {padding} from "@mui/system";

interface Props {
    handleChange: (event: any, from: any) => void,
    label?: string
    from?: string
    checked?: boolean
}

const MuiCheckbox = ({
    handleChange,
    label,
    from,
    checked
}: Props) => {

    return <div>
        <FormControlLabel
            sx={{
                padding:0,
        }}

            control={
                <Checkbox
                    onChange={(e) => handleChange(e, from)}
                    checked={checked}
                />}
            label={label} />
    </div>
}

export default MuiCheckbox 
