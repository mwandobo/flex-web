"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { post } from '@/utils/api'
import Button from '@/components/button'
import { Card } from '@mui/material'
import TextFieldComponent from '@/components/inputs/text-field'
import { setValueLocalStorage } from '@/utils/actions/local-starage'
import { useGlobalContextHook } from '@/hooks/useGlobalContextHook'
import Swal from "sweetalert2"


export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState('')
    const { dispatch } = useGlobalContextHook()

    const router = useRouter()

    const handleChange = (event: any, from: string) => {
        if (from === 'email') {
            setEmail(event.target.value)
        }
        if (from === 'password') {
            setPassword(event.target.value)
        }
    }

    async function handleSubmit() {
        try {
            setLoading(!loading)

            if (!email) {
                throw ('Email Not Found')
            }

            if (!password || password.length < 6) {
                throw ('Password Required and Must be Correct')
            }

            try {
                const response = await post<any>('login', { email, password })
                if (response.status === 200) {
                    const user = response?.data?.user
                    const role = response?.data?.role
                    const permissions = response?.data?.permissions
                    const approvals = response?.data?.approvals
                    const sys_approvals = response?.data?.sys_approvals
                    const approved_items = response?.data?.approved_items
                    const token = JSON.stringify(user?.token);

                    if (Number(user.is_otp_verified) === 0) {
                        router.push(`/verify-otp/${user.id}`)
                        return;
                    }

                    if (Number(user.is_password_changed) === 0) {
                        router.push(`/change-password/${user.id}`)
                        return;
                    }

                    // dispatch 
                    dispatch({ type: 'SET_CURRENT_USER', payload: user })
                    if (setValueLocalStorage('token', token) === 1 &&
                        setValueLocalStorage('user', JSON.stringify(user)) &&
                        setValueLocalStorage('role', JSON.stringify(role)) &&
                        setValueLocalStorage('permissions', JSON.stringify(permissions)) &&
                        setValueLocalStorage('approvals', JSON.stringify(approvals)) &&
                        setValueLocalStorage('sys_approvals', JSON.stringify(sys_approvals)) &&
                        setValueLocalStorage('approved_items', JSON.stringify(approved_items))
                    ) {
                        setLoading(!loading)
                        router.push('/')
                    } else {
                        alert('error setting value to local storage')
                    }
                }
            }
            catch (error) {
                throw error.message
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

    async function handleForgotPassword() {
        try {
            router.push('/forgot-password')
        } catch (error) {
            console.error('Error storing data in localStorage:', error);
        }
    }

    return (
        <>
            <div className='w-screen flex fixed top-0 left-0 h-screen shadow-lg z-20 -mr-64 flex-col items-center justify-center bg-white '>
                <img className='h-full' src="/background.png" />
                <div className="absolute mx-auto my-0 border border-gray-300 rounded bg-white" >
                    {loading ? <p>..... Loading......</p> :
                        <Card
                            raised={true}
                            className='p-5'
                        >
                            <div className="flex flex-col p-[15%] justify-center items-center w-full">
                                <img
                                    className='h-full'
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
                                <TextFieldComponent
                                    placeholder={'password'}
                                    from={'password'}
                                    label={"Password"}
                                    value={password}
                                    onChange={handleChange}
                                    isError={false}
                                    type='password'
                                    errorMessage={''}
                                />

                                <div className="flex justify-between">
                                    <Button
                                        text='Forgot Password'
                                        onClick={handleForgotPassword}
                                    />
                                    <Button
                                        text='Login'
                                        onClick={handleSubmit}
                                    />

                                </div>
                            </>
                        </Card>
                    }
                </div>
            </div>
        </>
    )
}