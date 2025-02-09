"use client"

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {post} from '@/utils/api'
import Button from '@/components/button'
import TextFieldComponent from '@/components/inputs/text-field'
import BackButton from "@/components/button/back-button";
import AuthSkeletonComponent from "@/components/page-components/auth-skeleton-component";
import {ReusableButton} from "@/components/button/reusable-button";
import {ArrowRightSquare} from "lucide-react";

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
        <AuthSkeletonComponent
            loading={loading}
        >
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
                    <ReusableButton
                        name="Send"
                        onClick={handleSubmit}
                        rounded={'md'}
                        padding={'p-1'}
                        shadow={'shadow-md'}
                        bg_color={'bg-gray-50'}
                        hover={'hover:bg-gray-200 hover:border-gray-400'}
                        hover_text={'hover:text-gray-900 hover:font-semibold'}
                        border={'border border-gray-300'}
                        text_color={'text-gray-700'}
                        isEndIcon={true}
                    >
                        <ArrowRightSquare size={18} />
                    </ReusableButton>
                </div>
            </>
        </AuthSkeletonComponent>
    )
}

export default VerifyOtp