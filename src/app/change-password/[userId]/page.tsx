"use client"

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { post } from '@/utils/api'
import Button from '@/components/button'
import { BackgroundDiv, FormContainer, LogoContainer, Image } from './login.styled'
import { Card } from '@mui/material'
import TextFieldComponent from '@/components/inputs/text-field'

const ChangePasswordPage = ({ params }: { params: { userId: string } }) => {
    const [new_password, setNewPassword] = useState('')
    const [new_password_confirmation, setNewPasswordConformation] = useState('')
    const [loading, setLoading] = useState(false)
    const userId = params.userId

    const email = ''

    const router = useRouter()

    const handleChange = (event: any, from: string) => {
        if (from === 'new_password') {
            setNewPassword(event.target.value)
        }
        if (from === 'new_password_confirmation') {
            setNewPasswordConformation(event.target.value)
        }
    }

    async function handleSubmit() {
        try {
            setLoading(!loading)
            const payload = {
                new_password, new_password_confirmation, user_id: userId

            }

            if (!new_password) {
                throw ('new_password Not Found')
            }

            if (!new_password_confirmation) {
                throw ('new_password_confirmation Not Found')
            }

            if (new_password !== new_password_confirmation) {
                throw ('password mismatch')
            }

            const response = await post<any>('user/changePassword', payload)

            if (response.status === 200) {
                setLoading(!loading)

                router.push('/login')
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
                                    placeholder={'New Password'}
                                    from={'new_password'}
                                    label={'New Password'}
                                    value={new_password}
                                    onChange={handleChange}
                                    isError={false}
                                    errorMessage={''}
                                />

                                <TextFieldComponent
                                    placeholder={'New Password Confirmation'}
                                    from={'new_password_confirmation'}
                                    label={'New Password Confirmation'}
                                    value={new_password_confirmation}
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

export default ChangePasswordPage