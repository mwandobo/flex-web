"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { post } from '@/utils/api'
import Button from '@/components/button'
import TextFieldComponent from '@/components/inputs/text-field'
import Swal from "sweetalert2"
import BackButton from "@/components/button/back-button";
import AuthSkeletonComponent from '@/components/page-components/auth-skeleton-component'
import {ReusableButton} from "@/components/button/reusable-button";
import {ArrowLeftSquare, ArrowRightSquare} from "lucide-react";

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
            title={'Forgot Password'}
            subtitle={'Enter your Email to get Recovery Email'}
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