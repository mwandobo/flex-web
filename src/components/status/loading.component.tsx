
import { OctagonX } from "lucide-react"

const Loading = () => {
    return (
        <div className="w-80 h-36 flex justify-center items-center bg-white ">
            <div className="animate-pulse p-2">
                <div className="flex flex-col space-y-10">
                    <img className='h-10 w-fit' src="/logo.png" alt="logo" />

                </div>
            </div>
        </div>
    )
}

export default Loading