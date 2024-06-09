import { CheckCircle2, EyeIcon, Pen, ShieldCheck, Trash2, X } from "lucide-react";
import { ReusableButton } from "../button/reusable-button";
import { checkPermissions } from "@/utils/actions/check-permissions";

interface Props {
    permission?: string;
    approval_name?: string;
    input?: any;
    handleClick?: (type: string, payload?: any) => void;
    hide_edit?: boolean;
    hide_approve?: boolean;
    hide_delete?: boolean;
    hide_view?: boolean;
    show_assign?: boolean;
}


const CrudButtonsComponent = ({
    permission,
    approval_name,
    input,
    handleClick,
    hide_approve,
    hide_delete,
    hide_view,
    hide_edit,
    show_assign
}: Props) => {

    const color = 'white';
    return <div className='p-0 m-0 inline-flex w-full gap-1'>
        {show_assign && checkPermissions(`${permission ? `${permission}-assign` : ""}`) &&
            <ReusableButton
                name='Assign'
                text_color='text-dark'
                onClick={() => handleClick && handleClick('assign', input)}
            >
                <ShieldCheck size={10} color={color} />
            </ReusableButton>
        }
        {!hide_view && checkPermissions(`${permission ? `${permission}-show` : ""}`) &&
            <ReusableButton
                name='View'
                text_color='text-dark'
                onClick={() => handleClick && handleClick('show', input)}
            >
                <EyeIcon size={10} color={color} />
            </ReusableButton>
        }
        {
            !hide_approve && checkPermissions(`${permission ? `${permission}-approve` : ""}`) &&
            <ReusableButton
                name='Approve'
                text_color='text-dark'
                onClick={() => handleClick && handleClick('approve', input)}
            >
                <CheckCircle2 size={10} color={color} />
            </ReusableButton>
        }
        {
            !hide_approve && checkPermissions(`${permission ? `${permission}-approve` : ""}`) &&
            <ReusableButton
                name='Disapprove'
                text_color='text-dark'
                onClick={() => handleClick && handleClick('disapprove', input)}
            >
                <X size={10} color={'red'} />
            </ReusableButton>
        }
        {
            !hide_delete && checkPermissions(`${permission ? `${permission}-delete` : ''}`) &&
            <ReusableButton
                name='Delete'
                text_color='text-dark'
                onClick={() => handleClick && handleClick('delete', input)}
            >
                <Trash2 size={10} color='red' />
            </ReusableButton>}

        {
            !hide_edit && checkPermissions(`${permission ? `${permission}-edit` : ""}`) &&
            <ReusableButton
                name='Edit'
                text_color='text-dark'
                onClick={() => handleClick && handleClick('edit', input)}
            >
                <Pen size={10} color={color} />
            </ReusableButton>
        }
    </div>
}

export default CrudButtonsComponent