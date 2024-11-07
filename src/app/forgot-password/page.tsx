"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { post } from '@/utils/api'
import Button from '@/components/button'
import TextFieldComponent from '@/components/inputs/text-field'
import Swal from "sweetalert2"
import BackButton from "@/components/button/back-button";
import Loading from "@/components/status/loading.component";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
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

                    router.push(`change-password/${user.id}`)
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
                                placeholder={'email'}
                                from={'email'}
                                label={'Email'}
                                value={email}
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