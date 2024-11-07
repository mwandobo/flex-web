"use client"

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {post} from '@/utils/api'
import Button from '@/components/button'
import TextFieldComponent from '@/components/inputs/text-field'
import Loading from "@/components/status/loading.component";
import BackButton from "@/components/button/back-button";

const VerifyOtp = ({params}: { params: { userId: string } }) => {
    const [otp, setNewOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const userId = params.userId
    const router = useRouter()

    const handleChange = (event: any, from: string) => {
        if (from === 'otp') {
            setNewOtp(event.target.value)
        }
    }

    async function handleSubmit() {
        try {
            setLoading(!loading)
            const payload = {
                otp,
                user_id: userId
            }

            if (!otp) {
                throw ('otp Not Found')
            }

            const response = await post<any>('user/verify_otp', payload)
            if (response.status === 200) {
                setLoading(!loading)

                router.push('/')
            }

        } catch (error) {
            console.error('Error storing data in :', error);
        }
    }

    return (
        <div className='w-screen h-screen fixed top-0 left-0 flex items-center justify-center bg-gray-300 z-30'>
            <div className="w-[80] border border-gray-300 bg-white">
                {loading ? (
                        <div className={'w-3/4'}>
                            <Loading/>
                        </div>
                    ) :
                    <div className='p-5'>
                        <div className="flex flex-col p-[15%] justify-center items-center w-full">
                            <img
                                width={'40%'}
                                src="/logo.png"/>
                        </div>
                        <>
                            <TextFieldComponent
                                placeholder={'Otp'}
                                from={'otp'}
                                label={'OTP'}
                                value={otp}
                                onChange={handleChange}
                                isError={false}
                                errorMessage={''}
                            />

                            <div className="flex justify-between">
                                <BackButton/>
                                <Button
                                    text='Send'
                                    onClick={handleSubmit}
                                />
                            </div>
                        </>
                    </div>
                }
            </div>
        </div>
    )
}

export default VerifyOtp