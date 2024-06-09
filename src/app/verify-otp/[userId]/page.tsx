"use client"

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { post } from '@/utils/api'
import Button from '@/components/button'
import { BackgroundDiv, FormContainer, LogoContainer, Image } from './login.styled'
import { Card } from '@mui/material'
import TextFieldComponent from '@/components/inputs/text-field'

const VerifyOtp = ({ params }: { params: { userId: string } }) => {

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

        <div className='w-screen flex fixed top-0 left-0 h-screen shadow-lg z-20 -mr-64 flex-col items-center justify-center bg-white '>
            <Image src="/background.png" />

            <FormContainer>
                {
                    loading ? <p>..... Loading......</p> :
                        <Card
                            raised={true}
                            className='p-5'
                        >
                            <LogoContainer>
                                <Image
                                    width={'40%'}
                                    src="/logo.png" />
                            </LogoContainer>
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

                                <div className="flex justify-end">
                                    <Button
                                        text='Send'
                                        onClick={handleSubmit}
                                    />
                                </div>
                            </>
                        </Card>
                }
            </FormContainer>


        </div>
    )
}

export default VerifyOtp