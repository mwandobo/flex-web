import { PlusCircle } from "lucide-react"
import MuiBreadcrumbs from "../breadcumb/mui-breadcumb"
import { ReusableButton } from "../button/reusable-button"
import BackButton from "../button/back-button"

interface Props {
    handleClick?: (type: string) => void
    links: any[]
    isShowPage?: boolean
    showrefresh?: boolean
    isHideAdd?: boolean
    isHideBack?: boolean
    isDownload?: boolean
    subHeader?: string
    ButtonDownloadComponent?: any
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
    ButtonDownloadComponent
}: Props) => {
    return (<div className='flex justify-between items-center p-1'>
        <>
            {subHeader ?
                <h4 className="text-sm font-semibold">{subHeader}</h4>
                :
                (subHeader === "" ? <></> : <MuiBreadcrumbs links={links} />)
            }
        </>

        <div className="flex justify-end items-center space-x-2">
            {
                isDownload && <ButtonDownloadComponent />
            }
            {isShowPage && !isHideBack &&
                <BackButton />
            }

            {!isShowPage && !isShowPage && !isHideAdd &&

                < div className=''>
                    <ReusableButton
                        name='Add'
                        onClick={() => handleClick && handleClick('create')}
                    >
                        <PlusCircle size={13} />
                    </ReusableButton>
                </div>
            }

        </div>
    </div>

    )
}

export default PageHeader