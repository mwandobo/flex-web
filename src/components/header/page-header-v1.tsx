import {PlusCircle} from "lucide-react"
import {ReusableButton} from "../button/reusable-button"
import BackButton from "@/components/button/back-button-v1";

interface Props {
    title?: string
    handleClick?: (type: string) => void
    isShowAddButton?: boolean
    isShowBackButton?:boolean
}

const PageHeader = ({
                        title,
                        isShowAddButton,
                        handleClick,
                        isShowBackButton
                    }: Props) => {
    return <div className='flex justify-between items-center p-2'>
        <h4 className="text-sm font-semibold">{title}</h4>
        {isShowAddButton &&
            < div className=''>
                <ReusableButton
                    name='Add'
                    onClick={() => handleClick && handleClick('create')}
                >
                    <PlusCircle size={13}/>
                </ReusableButton>
            </div>
        }
        {isShowBackButton &&
            < div className=''>
                <BackButton/>
            </div>
        }
    </div>


}

export default PageHeader