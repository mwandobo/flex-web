"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { post } from '@/utils/api'
import Button from '@/components/button'
import { Card } from '@mui/material'
import TextFieldComponent from '@/components/inputs/text-field'
import Swal from "sweetalert2"

const ChangePasswordPage = ({ params }: { params: { userId: string } }) => {
    const [new_password, setNewPassword] = useState('')
    const [new_password_confirmation, setNewPasswordConformation] = useState('')
    const [loading, setLoading] = useState(false)
    const userId = params.userId

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
            setLoading(true);

            // Validate inputs using regular flow control
            if (!new_password) {
                return Swal.fire({
                    title: 'Error Occured!',
                    text: 'New password not found',
                    icon: 'error',
                }).then(() => setLoading(false));
            }

            if (!new_password_confirmation) {
                return Swal.fire({
                    title: 'Error Occured!',
                    text: 'New password confirmation not found',
                    icon: 'error',
                }).then(() => setLoading(false));
            }

            if (new_password !== new_password_confirmation) {
                return Swal.fire({
                    title: 'Error Occured!',
                    text: 'Password mismatch',
                    icon: 'error',
                }).then(() => setLoading(false));
            }

            // Attempt the API call
            const response = await post<any>('user/changePassword', {
                new_password, new_password_confirmation, user_id: userId
            });

            if (response.status === 200) {
                setLoading(false);
                router.push('login');
            }
        } catch (error) {
            const message = error?.response?.data?.message || error.message || 'Unknown error occurred';

            // Show error alert
            Swal.fire({
                title: 'Error Occured!',
                text: message,
                icon: 'error',
            }).then(() => setLoading(false));

            console.error(error);
        }
    }



    return (

        <div className='w-screen flex fixed top-0 left-0 h-screen shadow-lg z-20 -mr-64 flex-col items-center justify-center bg-white '>
            <img className='h-full' src="/background.png" />

            <div className="absolute mx-auto my-0 border border-gray-300 rounded bg-white" >
                {
                    loading ? <p>..... Loading......</p> :
                        <Card
                            raised={true}
                            className='p-5'
                        >
                            <div className="flex flex-col p-[15%] justify-center items-center w-full">
                                <img className='h-full'
                                    width={'40%'}
                                    src="/logo.png" />
                            </div>
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
            </div>
        </div>
    )
}

export default ChangePasswordPage