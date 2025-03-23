import {PlusCircle} from "lucide-react"
import {ReusableButton} from "../button/reusable-button"
import BackButton from "@/components/button/back-button-v1";

interface Props {
    title?: string
    handleClick?: (type: string) => void
    isShowAddButton?: boolean
    isShowBackButton?:boolean
    fontSize?: string
}

const PageHeader = ({
                        title,
                        isShowAddButton,
                        handleClick,
                        isShowBackButton,
                        fontSize
                    }: Props) => {
    return <div className='flex justify-between items-center p-2'>
        <h4 className="text-sm font-semibold" style={{fontSize}}>{title}</h4>
        {isShowAddButton &&
            < div className=''>
                <ReusableButton
                    name='Add'
                    onClick={() => handleClick && handleClick('create')}
                    rounded={'md'}
                    padding={'p-1'}
                    shadow={'shadow-md'}
                    bg_color={'bg-gray-50'}
                    hover={'hover:bg-gray-200 hover:border-gray-400'}
                    hover_text={'hover:text-gray-900 hover:font-semibold'}
                    border={'border border-gray-300'}
                    text_color={'text-gray-700'}
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