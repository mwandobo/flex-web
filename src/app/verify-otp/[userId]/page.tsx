"use client"

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {post} from '@/utils/api'
import Button from '@/components/button'
import TextFieldComponent from '@/components/inputs/text-field'
import BackButton from "@/components/button/back-button";
import AuthSkeletonComponent from "@/components/page-components/auth-skeleton-component";

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
                    <Button
                        text='Send'
                        onClick={handleSubmit}
                    />
                </div>
            </>
        </AuthSkeletonComponent>
    )
}

export default VerifyOtp