
import { OctagonX } from "lucide-react"

const Loading = () => {
    return (
        <div className="w-full h-36 flex justify-center items-center ">
            <div className="animate-pulse">
                <div className="flex flex-col space-y-10">
                    <img className='h-10 w-fit' src="/logo.png" alt="logo" />

                </div>
            </div>
        </div>
    )
}

export default Loading