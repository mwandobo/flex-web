"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { post } from '@/utils/api'
import Button from '@/components/button'
import { Card } from '@mui/material'
import TextFieldComponent from '@/components/inputs/text-field'
import Swal from "sweetalert2"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    // const [password, setPassword] = useState('')
    const router = useRouter()

    const handleChange = (event: any, from: string) => {
        if (from === 'email') {
            setEmail(event.target.value)
        }
    }

    async function handleSubmit() {
        try {
            setLoading(!loading)

            if (!email) {
                throw ('Email Not Found')
            }

            try {
                const response = await post<any>('password_recovery', { email })

                if (response.status === 200) {
                    const user = response?.data?.user
                    setLoading(!loading)

                    router.push(`change-password?email=${email}`)
                }
            }
            catch (error) {
                const message = error.response.data.message ?? error.message
                throw message
            }
        } catch (error) {

            Swal.fire({
                title: 'Error Occured!',
                text: error,
                icon: 'error',
            }).then(() => setLoading(false))

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
                                <img
                                    width={'40%'}
                                    src="/logo.png" />
                            </div>
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
            </div>


        </div>
    )
}