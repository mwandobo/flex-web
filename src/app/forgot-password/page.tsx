"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { post } from '@/utils/api'
import Button from '@/components/button'
import TextFieldComponent from '@/components/inputs/text-field'
import Swal from "sweetalert2"
import BackButton from "@/components/button/back-button";
import AuthSkeletonComponent from '@/components/page-components/auth-skeleton-component'

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
        <AuthSkeletonComponent
            loading={loading}
        >
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
        </AuthSkeletonComponent>
    )
}