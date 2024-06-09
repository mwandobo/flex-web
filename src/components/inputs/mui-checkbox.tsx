import { FormControlLabel, Checkbox } from "@mui/material"

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
            control={
                <Checkbox
                    onChange={(e) => handleChange(e, from)}
                    checked={checked}
                />}
            label={label} />
    </div>
}

export default MuiCheckbox 
