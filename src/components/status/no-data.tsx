import { OctagonX } from "lucide-react"

const NoDataComponent = () => {
    return (
        <div className="w-full h-36 flex justify-center items-center ">
            <div className="animate-pulse">
                <OctagonX />
                <p>No data</p>
            </div>
        </div>
    )
}

export default NoDataComponent