"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { post } from '@/utils/api'
import Button from '@/components/button'
import { BackgroundDiv, FormContainer, LogoContainer, Image } from './login.styled'
import { Card } from '@mui/material'
import TextFieldComponent from '@/components/inputs/text-field'
import { setValueLocalStorage } from '@/utils/actions/local-starage'
import { useGlobalContextHook } from '@/hooks/useGlobalContextHook'

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

            const payload = {
                email, password
            }

            if (!email) {
                throw ('Email Not Found')
            }

            if (!password || password.length < 6) {
                throw ('Password required and mus be greater than 6')
            }

            const response = await post<any>('login', { email, password })
            const user = response?.data?.user
            const role = response?.data?.role
            const permissions = response?.data?.permissions
            const token = JSON.stringify(user?.token);

            // dispatch 
            dispatch({ type: 'SET_CURRENT_USER', payload: user })

            if (setValueLocalStorage('token', token) === 1 &&
                setValueLocalStorage('user', JSON.stringify(user)) &&
                setValueLocalStorage('role', JSON.stringify(role)) &&
                setValueLocalStorage('permissions', JSON.stringify(permissions))
            ) {
                setLoading(!loading)
                router.push('/')

            } else {
                alert('error setting value to local storage')

            }

        } catch (error) {
            console.error('Error storing data in localStorage:', error);
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
                <Image src="/background.png" />

                <FormContainer>

                    {loading ? <p>..... Loading......</p> :

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
                </FormContainer>

            </div>
        </>


    )
}