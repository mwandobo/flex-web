"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { post } from '@/utils/api'
import Button from '@/components/button'
import { BackgroundDiv, FormContainer, LogoContainer, Image } from './login.styled'
import { Card } from '@mui/material'
import TextFieldComponent from '@/components/inputs/text-field'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    // const [password, setPassword] = useState('')
    const router = useRouter()

    const handleChange = (event: any, from: string) => {
        if (from === 'email') {
            setEmail(event.target.value)
        }
        // if (from === 'password') {
        //     setPassword(event.target.value)
        // }
    }

    async function handleSubmit() {
        try {
            setLoading(!loading)
            const payload = {
                email
            }

            if (!email) {
                throw ('Email Not Found')
            }

            const response = await post<any>('password_recovery', { email })

            if (response.status === 200) {
                const user = response?.data?.user
                setLoading(!loading)

                router.push(`change-password?email=${email}`)
            }

        } catch (error) {
            console.error('Error storing data in localStorage:', error);
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
                                    placeholder={'email'}
                                    from={'email'}
                                    label={'Email'}
                                    value={email}
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