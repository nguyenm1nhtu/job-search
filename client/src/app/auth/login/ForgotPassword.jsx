'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from '@/app/components/button';
import Input from '@/app/components/input';
import validateField from '@/app/components/validatedInput';
import showToast from '@/app/components/Toastify.js';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function ForgotPassword({ setIsForgotPassWord }) {
    const [form, setForm] = useState({ email: '', otp: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({ email: '', otp: '', password: '', confirmPassword: '' });
    const [status, setStatus] = useState(1);
    const [isResendDisabled, setIsResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Đếm ngược gửi mã OTP
    useEffect(() => {
        let timer;
        if (isResendDisabled && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        setIsResendDisabled(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isResendDisabled, countdown]);

    const isEmailValid = form.email && !validateField('email', form.email, new FormData());

    const handleForgetPassword = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        if (status === 1) {
            setErrors({
                email: validateField('email', formData.get('email'), formData),
                otp: validateField('otp', formData.get('otp'), formData),
                password: '',
                confirmPassword: '',
            });

            if (!errors.email && !errors.otp && formData.get('otp')) {
                setStatus(2);
                console.log(status);
            }
        } else if (status === 2) {
            setErrors({
                email: '',
                otp: '',
                password: validateField('password', formData.get('password'), formData, 'forgotPassword'),
                confirmPassword: validateField('confirmPassword', formData.get('confirmPassword'), formData),
            });

            if (!errors.password && !errors.confirmPassword) {
                setStatus(3);
                console.log(status);
            }
        }
    };

    const handleSendOTP = () => {
        const emailError = validateField('email', form.email, new FormData());
        if (!emailError) {
            console.log('Sending OTP to:', form.email);
            console.log('Calling showToast');
            showToast('success', 'OTP sent! Please check your email.');
            setIsResendDisabled(true);
            setCountdown(50);
        } else {
            setErrors((prev) => ({ ...prev, email: emailError }));
        }
    };

    const handleKeyDown = (e) => {
        if (
            !/^[0-9]{1}$/.test(e.key) &&
            e.key !== 'Backspace' &&
            e.key !== 'Delete' &&
            e.key !== 'ArrowLeft' &&
            e.key !== 'ArrowRight' &&
            e.key !== 'Tab' &&
            !e.metaKey
        ) {
            e.preventDefault();
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const formData = new FormData(e.target.form);
        setForm((prev) => ({ ...prev, [name]: value }));
        const error = validateField(name, value, formData, 'forgotPassword');
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleBackToLogin = () => {
        setForm({ email: '', otp: '', password: '', confirmpPassword: '' });
        setErrors({ email: '', otp: '', password: '', confirmPassword: '' });
        setStatus(1);
        setIsResendDisabled(false);
        setCountdown(0);
        setIsForgotPassWord(false);
    };

    return (
        <>
            {status === 1 ? (
                <form onSubmit={handleForgetPassword} noValidate>
                    <div className="w-full flex flex-col">
                        <h1 className="text-6xl font-extrabold mb-4 uppercase">Forgot password ?</h1>
                        <p className="my-3 text-[var(--text-color)] text-[16px] font-semibold">
                            No worries, we'll send you reset instructions.
                        </p>

                        <div className="mt-8 mb-2 flex flex-col">
                            <span className="mb-4 font-[600]">Email</span>
                            <Input
                                type="email"
                                name="email"
                                value={form.email}
                                placeholder="Enter your email"
                                onChange={handleInputChange}
                                variant="register_login"
                                error={errors.email}
                                errorClassName={'pt-[4px] text-[1rem] min-h-[1.9rem]'}
                            />

                            <div className="relative mt-4">
                                <Input
                                    type="tel"
                                    name="otp"
                                    value={form.otp}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Enter your code"
                                    variant="register_login"
                                    error={errors.otp}
                                    errorClassName={'pt-[4px] text-[1rem] min-h-[1.9rem]'}
                                    maxLength="6"
                                />
                                <Button
                                    variant="otp"
                                    className="absolute translate-y-[-72%] top-1/2 w-[14rem]"
                                    onClick={handleSendOTP}
                                    disabled={isResendDisabled || !isEmailValid}
                                >
                                    {isResendDisabled ? (
                                        <p>
                                            Send again <span className="ml-1">{countdown}</span>
                                        </p>
                                    ) : (
                                        <p>Send code</p>
                                    )}
                                </Button>
                            </div>
                        </div>

                        <p className="my-3 text-[#6f7882] text-[14px]">
                            By changing your password, you agree to our{' '}
                            <Link href="#" className="font-semibold text-black underline">
                                Term of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="#" className="font-semibold text-black underline">
                                Privacy Policy.
                            </Link>
                        </p>

                        <Button type="submit" variant="auth">
                            Reset Your Password
                        </Button>

                        <div className="flex justify-between mt-4">
                            <button
                                onClick={handleBackToLogin}
                                className="text-[var(--primary-color)] text-[14px] cursor-pointer"
                            >
                                <FontAwesomeIcon
                                    icon={faArrowLeft}
                                    className="w-7 h-7 mr-3 text-[var(--primary-color)]"
                                />
                                Back to Log In
                            </button>
                            <Link href="./register" className="text-[var(--primary-color)] text-[14px]">
                                Register an Account
                            </Link>
                        </div>
                    </div>
                </form>
            ) : status === 2 ? (
                <form onSubmit={handleForgetPassword} noValidate>
                    <div className="w-full flex flex-col">
                        <h1 className="text-6xl font-extrabold mb-4 uppercase">Set new password</h1>
                        <p className="my-3 text-[var(--text-color)] text-[16px] font-semibold">
                            Enter your new password to continue exploring BotCV.
                        </p>

                        <div className="mt-8 mb-2 flex flex-col">
                            <span className="mb-4 font-[600]">Password</span>
                            <Input
                                type="password"
                                name="password"
                                value={form.password}
                                placeholder="Enter your password"
                                onChange={handleInputChange}
                                variant="register_login"
                                error={errors.password}
                                errorClassName={'pt-[4px] text-[1rem] min-h-[1.9rem]'}
                                hide="true"
                            />
                            <ul className="text-[12px] text-[var(--text-color)] font-semibold mt-1 mb-2">
                                <li>Password needs above 6 letters.</li>
                                <li>Password must include uppercase letters, lowercase letters, and numbers.</li>
                            </ul>

                            <span className="mb-4 mt-2 font-[600]">Confirm Password</span>
                            <Input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                placeholder="Enter your password again"
                                onChange={handleInputChange}
                                variant="register_login"
                                error={errors.confirmPassword}
                                errorClassName={'pt-[4px] text-[1rem] min-h-[1.9rem]'}
                                hide="true"
                            />
                        </div>

                        <p className="mb-3 text-[#6f7882] text-[14px]">
                            By changing your password, you agree to our{' '}
                            <Link href="#" className="font-semibold text-black underline">
                                Term of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="#" className="font-semibold text-black underline">
                                Privacy Policy.
                            </Link>
                        </p>

                        <Button type="submit" variant="auth">
                            Reset Your Password
                        </Button>

                        <div className="flex justify-between mt-4">
                            <button
                                onClick={handleBackToLogin}
                                className="text-[var(--primary-color)] text-[14px] cursor-pointer"
                            >
                                <FontAwesomeIcon
                                    icon={faArrowLeft}
                                    className="w-7 h-7 mr-3 text-[var(--primary-color)]"
                                />
                                Back to Log In
                            </button>
                            <Link href="./register" className="text-[var(--primary-color)] text-[14px]">
                                Register an Account
                            </Link>
                        </div>
                    </div>
                </form>
            ) : status === 3 ? (
                <div className="w-full h-full flex flex-col justify-center items-center p-10">
                    <Image
                        src="/img/auth/reset-password.png"
                        alt="password image"
                        width={110}
                        height={110}
                        className="object-cover"
                        priority
                    />
                    <h1 className="mt-15 text-7xl font-semibold">Password Changed!</h1>
                    <p className="my-5 mb-16 text-[var(--text-color)] text-[16px] font-semibold">
                        You've successfully finished your password reset.
                    </p>
                    <Button onClick={handleBackToLogin} variant="auth" className="mb-20">
                        What Are You Waiting For? Log In Now!
                    </Button>
                </div>
            ) : (
                ''
            )}
        </>
    );
}
