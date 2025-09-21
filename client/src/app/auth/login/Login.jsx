'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from '@/app/components/button';
import Input from '@/app/components/input';
import validateField from '@/app/components/validatedInput';
import ForgotPassword from './ForgotPassword';
import showToast from '@/app/components/Toastify';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebookF, faGithub } from '@fortawesome/free-brands-svg-icons';
import api from '@/app/api/axios';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '', general: '' });
    const [isForgotPassword, setIsForgotPassWord] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrors({ email: '', password: '', general: '' });

        const formData = new FormData(e.target);
        const newErrors = {
            email: validateField('email', formData.get('email')),
            password: validateField('password', formData.get('password')),
        };

        if (Object.values(newErrors).some((error) => error && error !== ' ')) {
            setErrors(newErrors);
            return;
        }

        const userData = {
            email: formData.get('email'),
            password: formData.get('password'),
        };

        console.log(errors);

        try {
            const response = await api.post('/api/auth/login', userData);
            const { token, refreshToken } = response.data.data;
            showToast('success', 'Đăng nhập thành công!');

            // Lưu token
            const isRemember = formData.get('remember') === 'on';
            const storage = isRemember ? localStorage : sessionStorage;
            storage.setItem('accessToken', token);
            storage.setItem('refreshToken', refreshToken);
            if (isRemember) {
                //Lưu vào localStorage: 7 ngày
                storage.setItem('tokenExpiry', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());
            } else {
                //Lưu vào sessionStorage: 30 phút
                storage.setItem('tokenExpiry', new Date(Date.now() + 24 * 30 * 60 * 1000).toISOString());
            }

            router.push('/');
        } catch (err) {
            setErrors({
                general: err.response?.data?.errors.error,
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
        const error = validateField(name, value);
        setErrors((prev) => ({
            ...prev,
            [name]: error,
            general: '',
        }));
    };

    return (
        <>
            <div className="w-full h-screen flex items-center justify-center bg-black">
                <div
                    className="flex w-[96vw] h-[95vh] rounded-[10px] overflow-hidden shadow-[0_5px_15px_rgb(0,0,0,0.35)] bg-black"
                    id="container"
                >
                    <div className="relative w-1/2 h-full flex flex-col rounded-[10px] overflow-hidden bg-black mr-2 select-none">
                        <Image src="/img/auth/signin.jpg" alt="SignIn" fill className="object-cover" priority />
                        <Link
                            href="/"
                            className="absolute top-0 left-0 ml-7 mt-5 text-[2rem] text-white cursor-pointer"
                        >
                            <p style={{ fontFamily: 'iconFont, sans-serif' }}>BotCV</p>
                        </Link>
                        <div className="absolute flex right-[4rem] translate-y-[75%] uppercase opacity-80">
                            <h1 className="text-white text-8xl font-bold animated-leftToRight">
                                Bạn Đã
                                <br />
                                Trở Lại!
                            </h1>
                            <div className="ml-[4rem] bg-white block w-[2rem]"></div>
                        </div>
                    </div>
                    <div className="bg-white w-1/2 rounded-[10px] ml-3 p-16">
                        {isForgotPassword ? (
                            <ForgotPassword setIsForgotPassWord={setIsForgotPassWord} />
                        ) : (
                            <form onSubmit={handleLogin} noValidate>
                                <div className="w-full flex flex-col">
                                    <h1 className="text-6xl font-extrabold mb-4 uppercase">ĐĂNG NHẬP</h1>
                                    <p className="my-3 text-[var(--text-color)] text-[14px] font-semibold">
                                        Chào mừng bạn trở lại với BotCV, một trong những nền tảng tìm kiếm việc làm hàng
                                        đầu Việt Nam - nơi khởi đầu cho hành trình sự nghiệp của bạn!
                                    </p>

                                    <div className="mt-7 mb-2 flex flex-col">
                                        <span className="mb-4 font-[600]">Email</span>
                                        <Input
                                            type="email"
                                            name="email"
                                            onChange={handleInputChange}
                                            placeholder="Email của bạn"
                                            value={email}
                                            error={errors.email}
                                            variant="register_login"
                                            errorClassName={'pt-[4px] text-[1rem] min-h-[1.9rem]'}
                                        />
                                        <span className="mt-1 mb-4 font-[600]">Mật khẩu</span>
                                        <Input
                                            type="password"
                                            name="password"
                                            onChange={handleInputChange}
                                            placeholder="Mật khẩu của bạn"
                                            value={password}
                                            error={errors.password || errors.general}
                                            variant="register_login"
                                            errorClassName={'pt-[4px] text-[1rem] min-h-[1.9rem]'}
                                            hide="true"
                                        />
                                    </div>
                                    <p className="text-[#6f7882] text-[14px] my-3">
                                        Chưa có tài khoản?{' '}
                                        <Link href="./register" className="text-black underline font-semibold ml-1">
                                            Tạo tài khoản BotCV
                                        </Link>
                                    </p>
                                    <div className="flex justify-between my-3 items-center text-[14px]">
                                        <div className="flex text-left">
                                            <input
                                                type="checkbox"
                                                name="remember"
                                                id="remember"
                                                className="w-7 h-7 rounded accent-black mt-[2px] cursor-pointer"
                                            />
                                            <label
                                                htmlFor="remember"
                                                className="relative flex items-center cursor-pointer"
                                            >
                                                <span className="ml-3 text-[black] text-[14px] font-semibold select-none">
                                                    Ghi nhớ đăng nhập trong 7 ngày
                                                </span>
                                            </label>
                                        </div>
                                        <div
                                            onClick={() => setIsForgotPassWord(true)}
                                            className="underline cursor-pointer"
                                        >
                                            <span>Quên mật khẩu?</span>
                                        </div>
                                    </div>
                                    <Button type="submit" variant="auth" className="my-8 text-white">
                                        Đăng nhập — Tiếp tục hành trình tìm kiếm việc làm với BotCV
                                    </Button>
                                </div>
                                <div className="flex items-center w-full">
                                    <div className="flex-grow h-px bg-gray-400"></div>
                                    <span className="px-7 text-gray-500 text-[14px]">Hoặc</span>
                                    <div className="flex-grow h-px bg-gray-400"></div>
                                </div>
                                <div className="flex items-center justify-center my-7">
                                    <Button variant="socialMedia" className="bg-[#e73b2f] mr-2">
                                        <FontAwesomeIcon icon={faGoogle} className="absolute left-23 w-6 h-6" />
                                        <p>Google</p>
                                    </Button>
                                    <Button variant="socialMedia" className="bg-[#1877f2] mx-2">
                                        <FontAwesomeIcon icon={faFacebookF} className="absolute left-20 w-6 h-6" />
                                        <p>Facebook</p>
                                    </Button>
                                    <Button variant="socialMedia" className="bg-[black] ml-2">
                                        <FontAwesomeIcon icon={faGithub} className="absolute left-23 w-6 h-6" />
                                        <p>Github</p>
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
