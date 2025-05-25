'use client';

import Link from 'next/link';
import Image from 'next/image';
import Loading from '@/app/components/loading/loading';
import Button from '@/app/components/button.jsx';
import Input from '@/app/components/input';
import validateField from '@/app/components/validatedInput';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Register() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ username: '', email: '', password: '', confirmPassword: '' });

    const handleRegister = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        setErrors({
            username: validateField('username', formData.get('username'), formData),
            email: validateField('email', formData.get('email'), formData),
            password: validateField('password', formData.get('password'), formData, 'register'),
            confirmPassword: validateField('confirmPassword', formData.get('confirmPassword'), formData),
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const formData = new FormData(e.target.form);
        const error = validateField(name, value, formData, 'register');
        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    };

    return (
        <>
            {isLoading && <Loading />}
            {/*Background*/}
            <div className="w-full h-screen flex items-center justify-center bg-black">
                {/*Container*/}
                <div
                    className="flex w-[96vw] h-[95vh] rounded-[10px] overflow-hidden shadow-[0_5px_15px_rgb(0,0,0,0.35)] bg-black"
                    id="container"
                >
                    <div className="relative w-1/2 h-full flex flex-col rounded-[10px] overflow-hidden bg-black mr-2 select-none">
                        <Image src="/img/auth/signup.jpg" alt="SignUp" fill className="object-cover" priority />

                        <Link
                            href="/"
                            className="absolute top-0 left-0 ml-7 mt-5 text-[2rem] text-white cursor-pointer"
                        >
                            <p style={{ fontFamily: 'iconFont, sans-serif' }}>BotCV</p>
                        </Link>

                        <div className="absolute flex right-[4rem] translate-y-[75%] uppercase opacity-80">
                            <h1 className="text-white text-8xl font-bold animated-leftToRight">
                                Hello
                                <br />
                                friend!
                            </h1>
                            <div className="ml-[4rem] bg-white block w-[2rem]"></div>
                        </div>
                    </div>

                    <div className="bg-white w-1/2 rounded-[10px] ml-3 p-16">
                        {/* <form onSubmit={handleLogin} noValidate> */}
                        <form onSubmit={handleRegister} noValidate>
                            <div className="w-full flex flex-col">
                                <h1 className="text-6xl font-extrabold mb-3 uppercase">Register on BotCV</h1>
                                <div className="mt-7 mb-2 flex flex-col">
                                    <span className="mb-4 font-[600]">Username</span>
                                    <Input
                                        type="text"
                                        name="username"
                                        onChange={handleInputChange}
                                        placeholder="Enter your username"
                                        error={errors.username}
                                        variant="register_login"
                                        errorClassName={'pt-[4px] text-[1rem] min-h-[1.9rem]'}
                                    />

                                    <span className="mb-4 font-[600]">Email</span>
                                    <Input
                                        type="email"
                                        name="email"
                                        onChange={handleInputChange}
                                        placeholder="Enter your email"
                                        error={errors.email}
                                        variant="register_login"
                                        errorClassName={'pt-[4px] text-[1rem] min-h-[1.9rem]'}
                                    />

                                    <span className="mb-4 font-[600]">Password</span>
                                    <Input
                                        type="password"
                                        name="password"
                                        onChange={handleInputChange}
                                        placeholder="Enter your password"
                                        error={errors.password}
                                        variant="register_login"
                                        errorClassName={'pt-[4px] text-[1rem] min-h-[1.9rem]'}
                                        hide="true"
                                    />
                                    <ul className="text-[12px] text-[var(--text-color)] font-semibold mt-1 mb-2">
                                        <li>Password needs above 6 letters.</li>
                                        <li>
                                            Password must include uppercase letters, lowercase letters, and numbers.
                                        </li>
                                    </ul>

                                    <span className="mb-4 font-[600] ">Confirm Password</span>
                                    <Input
                                        type="password"
                                        name="confirmPassword"
                                        onChange={handleInputChange}
                                        placeholder="Enter your password again"
                                        error={errors.confirmPassword}
                                        variant="register_login"
                                        hide="true"
                                    />
                                    <p className="mt-5 text-[14px] text-[#6f7882]">
                                        Oh! Already have an account?{' '}
                                        <Link href="./login" className="font-semibold text-black underline">
                                            Let's sign in.
                                        </Link>
                                    </p>
                                    <p className="mt-3 text-[#6f7882] text-[14px]">
                                        By creating this account, you agree to our{' '}
                                        <Link href="#" className="font-semibold text-black underline">
                                            Term of Service
                                        </Link>{' '}
                                        and{' '}
                                        <Link href="#" className="font-semibold text-black underline">
                                            Privacy Policy.
                                        </Link>
                                    </p>

                                    <Button variant="auth">Register — Start Your Journey From Today</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
