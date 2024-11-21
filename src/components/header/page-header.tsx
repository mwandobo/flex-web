import {PlusCircle} from "lucide-react"
import MuiBreadcrumbs from "../breadcumb/mui-breadcumb"
import {ReusableButton} from "../button/reusable-button"
import BackButton from "../button/back-button"
import {ReactNode} from "react"

interface Props {
    handleClick?: (type: string) => void
    links?: any[]
    isShowPage?: boolean
    showrefresh?: boolean
    isHideAdd?: boolean
    isHideBack?: boolean
    isDownload?: boolean
    subHeader?: string
    ButtonDownloadComponent?: ReactNode,
    isSmallButton?: boolean
}

const PageHeader = ({
                        handleClick,
                        links,
                        isShowPage,
                        showrefresh,
                        isHideBack,
                        isDownload,
                        isHideAdd,
                        subHeader,
                        isSmallButton,
                        ButtonDownloadComponent
                    }: Props) => {
    return (<div className='flex justify-between items-center p-1'>
            <>
                {subHeader ?
                    <h4 className="text-sm font-medium">{subHeader}</h4>
                    :
                    (subHeader === "" ? <></> : <MuiBreadcrumbs links={links}/>)
                }
            </>

            <div className="flex justify-end items-center space-x-2">
                {
                    isDownload && ButtonDownloadComponent
                }
                {isShowPage && !isHideBack &&
                    <BackButton/>
                }

                {!isShowPage && !isShowPage && !isHideAdd &&

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
                            <PlusCircle size={18}/>
                        </ReusableButton>
                    </div>
                }

            </div>
        </div>
    )
}

export default PageHeader