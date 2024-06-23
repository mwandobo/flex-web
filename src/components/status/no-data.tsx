import { OctagonX } from "lucide-react"

const NoDataComponent = () => {
    return (
        <div className="w-full h-36 flex justify-center items-center ">
            <div className="animate-pulse flex flex-col justify-center items-center">
                <OctagonX />
                <p className="font-semibold">No data</p>
            </div>
        </div>
    )
}

export default NoDataComponent