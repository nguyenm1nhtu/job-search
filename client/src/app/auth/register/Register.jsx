'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from '@/app/components/button.jsx';
import Input from '@/app/components/input';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import api from '@/app/api/axios';
import validateField from '@/app/components/validatedInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import showToast from '@/app/components/Toastify';

export default function Register() {
    const router = useRouter();
    const [errors, setErrors] = useState({});
    const [formValues, setFormValues] = useState({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        company_name: '',
        company_description: '',
        website: '',
        province_code: '',
        ward_code: '',
        address: '',
    });
    const [step, setStep] = useState(1);
    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);

    //Lay danh sach tinh thanh
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await api.get('/location/provinces');
                setProvinces(response.data.data);
            } catch (err) {
                console.error('Lỗi khi fetch tỉnh thành:', err);
                setErrors({ general: 'Không tải được tỉnh thành!' });
            }
        };
        fetchProvinces();
    }, []);

    //Lay danh sach quan huyen
    useEffect(() => {
        const fetchWards = async () => {
            if (formValues.province_code) {
                try {
                    const response = await api.get(`/location/wards?provinceCode=${formValues.province_code}`);
                    setWards(response.data.data);
                } catch (err) {
                    console.error('Lỗi khi fetch quận huyện:', err);
                    setErrors({ general: 'Không tải được quận huyện!' });
                }
            } else {
                setWards([]);
            }
        };
        fetchWards();
    }, [formValues.province_code]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: '',
        }));
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        setErrors({});

        const newErrors = {};
        const formData = new FormData();
        formData.append('password', formValues.password);

        newErrors.full_name = validateField('username', formValues.full_name);
        newErrors.email = validateField('email', formValues.email);
        newErrors.password = validateField('password', formValues.password, formData, 'register');
        newErrors.confirmPassword = validateField('confirmPassword', formValues.confirmPassword, formData);

        const hasErrors = Object.values(newErrors).some((error) => error && error !== ' ');
        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        setStep(2);
    };

    const handleRegister = async (e, role) => {
        e.preventDefault();
        setErrors({});

        if (role === 'recruiter') {
            const newErrors = {};
            if (!formValues.company_name) newErrors.company_name = 'Hãy điền tên công ty của bạn!';
            if (!formValues.website) newErrors.website = 'Hãy điền website cho công ty của bạn!';
            if (!formValues.province_code) newErrors.province_code = 'Hãy lựa chọn tỉnh thành!';
            if (!formValues.ward_code) newErrors.ward_code = 'Hãy lựa chọn quận huyện!';
            if (!formValues.address) newErrors.address = 'Điền đầy đủ địa chỉ chi tiết!';

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                setStep(3);
                return;
            }
        }

        const data = {
            full_name: formValues.full_name,
            email: formValues.email,
            password: formValues.password,
            role,
            ...(role === 'recruiter'
                ? {
                      company_name: formValues.company_name,
                      company_description: formValues.company_description || '',
                      website: formValues.website,
                      province_code: formValues.province_code,
                      ward_code: formValues.ward_code,
                      address: formValues.address,
                  }
                : {}),
        };

        try {
            const response = await api.post('/api/auth/register', data);
            showToast('success', 'Đăng ký thành công!');
            router.push('./login');
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
                if (
                    role === 'recruiter' &&
                    (err.response.data.errors.company_name ||
                        err.response.data.errors.company_description ||
                        err.response.data.errors.website ||
                        err.response.data.errors.province_code ||
                        err.response.data.errors.ward_code ||
                        err.response.data.errors.address)
                ) {
                    setStep(3);
                } else {
                    setStep(1);
                }
            } else {
                setErrors({ general: err.response?.data?.message || 'Đăng ký thất bại!' });
                setStep(1);
            }
        }
    };

    return (
        <>
            <div className="w-full h-screen flex items-center justify-center bg-black">
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
                                Xin
                                <br />
                                Chào!
                            </h1>
                            <div className="ml-[4rem] bg-white block w-[2rem]"></div>
                        </div>
                    </div>

                    <div className="bg-white w-1/2 rounded-[10px] ml-3 p-16">
                        <div className="w-full flex flex-col">
                            <h1 className="text-6xl font-extrabold mb-3 uppercase">Đăng ký tài khoản BOTCV</h1>

                            {step === 1 && (
                                <form onSubmit={handleNextStep} noValidate>
                                    <div className="mt-7 mb-2 flex flex-col">
                                        <span className="mb-4 font-[600]">Tên đăng nhập</span>
                                        <Input
                                            type="text"
                                            name="full_name"
                                            onChange={handleInputChange}
                                            value={formValues.full_name}
                                            placeholder="Your username"
                                            error={errors.full_name}
                                            variant="register_login"
                                            errorClassName={'pt-[4px] text-[1rem] min-h-[1.9rem]'}
                                        />
                                        <span className="mb-4 font-[600]">Email</span>
                                        <Input
                                            type="email"
                                            name="email"
                                            onChange={handleInputChange}
                                            value={formValues.email}
                                            placeholder="Your email"
                                            error={errors.email}
                                            variant="register_login"
                                            errorClassName={'pt-[4px] text-[1rem] min-h-[1.9rem]'}
                                        />
                                        <span className="mb-4 font-[600]">Mật khẩu</span>
                                        <Input
                                            type="password"
                                            name="password"
                                            onChange={handleInputChange}
                                            value={formValues.password}
                                            placeholder="Your password"
                                            error={errors.password}
                                            variant="register_login"
                                            errorClassName={'pt-[4px] text-[1rem] min-h-[1.9rem]'}
                                            hide="true"
                                        />
                                        <ul className="text-[12px] text-[var(--text-color)] font-semibold mt-1 mb-2">
                                            <li>Mật khẩu phải chứa ít nhất 6 ký tự</li>
                                            <li>Mật khẩu phải bao gồm chữ viết hoa, chữ thường và số</li>
                                        </ul>
                                        <span className="mb-4 font-[600]">Xác nhận mật khẩu</span>
                                        <Input
                                            type="password"
                                            name="confirmPassword"
                                            onChange={handleInputChange}
                                            value={formValues.confirmPassword}
                                            placeholder="Confirm your password"
                                            error={errors.confirmPassword}
                                            variant="register_login"
                                            errorClassName={'pt-[4px] text-[1rem] min-h-[1.9rem]'}
                                            hide="true"
                                        />
                                        <p className="mt-5 text-[14px] text-[#6f7882]">
                                            Bạn đã có sẵn tài khoản?{' '}
                                            <Link href="./login" className="font-semibold text-black underline">
                                                Đăng nhập ngay.
                                            </Link>
                                        </p>
                                        <p className="mt-3 text-[#6f7882] text-[14px]">
                                            Với việc tạo tài khoản bạn đã đồng ý với{' '}
                                            <Link href="#" className="font-semibold text-black underline">
                                                Điều khoản dịch vụ
                                            </Link>{' '}
                                            và{' '}
                                            <Link href="#" className="font-semibold text-black underline">
                                                Chính sách bảo mật
                                            </Link>
                                        </p>
                                        <Button variant="auth" className="my-8">
                                            Đăng ký ngay để bắt đầu cuộc hành trình của bạn
                                        </Button>
                                    </div>
                                </form>
                            )}

                            {step === 2 && (
                                <div className="w-full flex flex-col">
                                    <p className="mt-20 text-[var(--text-color)] text-[16px] font-semibold text-center">
                                        Để nâng cao trải nghiệm sử dụng BOTCV, <br />
                                        hãy chọn một vai trò phù hợp nhất với bạn.
                                    </p>
                                    <div className="w-full flex flex gap-10 pb-20 pt-10">
                                        <button
                                            onClick={(e) => handleRegister(e, 'candidate')}
                                            className="flex-col cursor-pointer"
                                        >
                                            <img src="/img/auth/candidate.png" alt="candidate" />
                                            <p className="mt-7 rounded-[10px] border border-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white text-[var(--primary-color)] font-semibold p-5">
                                                Đăng ký với vai trò là ứng viên
                                            </p>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setFormValues((prev) => ({ ...prev, role: 'recruiter' }));
                                                setStep(3);
                                            }}
                                            className="flex-col cursor-pointer"
                                        >
                                            <img src="/img/auth/recruiter.png" alt="recruiter" />
                                            <p className="mt-7 rounded-[10px] border border-[var(--recuitment-color)] text-[var(--recuitment-color)] hover:bg-[var(--recuitment-color)] hover:text-white font-semibold p-5">
                                                Đăng ký với vai trò là nhà tuyển dụng
                                            </p>
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => setStep(1)}
                                        className="text-[var(--primary-color)] text-[14px] cursor-pointer"
                                    >
                                        <FontAwesomeIcon
                                            icon={faArrowLeft}
                                            className="w-7 h-7 mr-3 text-[var(--primary-color)]"
                                        />
                                        Quay lại
                                    </button>
                                </div>
                            )}

                            {step === 3 && (
                                <form onSubmit={(e) => handleRegister(e, 'recruiter')} noValidate>
                                    <div className="mt-7 mb-2 flex flex-col">
                                        <span className="my-2 font-[600]">Tên công ty</span>
                                        <Input
                                            type="text"
                                            name="company_name"
                                            onChange={handleInputChange}
                                            value={formValues.company_name}
                                            placeholder="Your company name"
                                            error={errors.company_name}
                                            variant="register_login"
                                            errorClassName={'pt-[4px] text-[1rem] min-h-[1.9rem]'}
                                        />
                                        <span className="my-2 font-[600]">Website</span>
                                        <Input
                                            type="url"
                                            name="website"
                                            onChange={handleInputChange}
                                            value={formValues.website}
                                            placeholder="Company website"
                                            error={errors.website}
                                            variant="register_login"
                                            errorClassName={'pt-[4px] text-[1rem] min-h-[1.9rem]'}
                                        />
                                        <span className="my-2 font-[600]">Tỉnh thành</span>
                                        <div className="relative w-full h-full group">
                                            <Select
                                                options={provinces.map((p) => ({ value: p.code, label: p.name }))}
                                                onChange={(option) =>
                                                    handleInputChange({
                                                        target: { name: 'province_code', value: option.value },
                                                    })
                                                }
                                                value={
                                                    provinces
                                                        .map((p) => ({ value: p.code, label: p.name }))
                                                        .find((p) => p.value === formValues.province_code) || null
                                                }
                                                className="w-full h-[4.5rem] text-2xl border border-gray-300 rounded-[5px] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                                                classNamePrefix="react-select"
                                                menuPlacement="bottom"
                                                maxMenuHeight={200}
                                                placeholder="Select province"
                                                styles={{
                                                    control: (base) => ({
                                                        ...base,
                                                        height: '4.5rem',
                                                        minHeight: '4.5rem',
                                                        fontSize: '1.5rem',
                                                        paddingLeft: '1.25rem',
                                                        paddingRight: '3rem',
                                                    }),
                                                    menu: (base) => ({
                                                        ...base,
                                                        zIndex: 10,
                                                    }),
                                                }}
                                            />
                                        </div>

                                        {errors.province_code && (
                                            <p className="text-[var(--invalid-color)] font-semibold pt-[4px] text-[1rem] min-h-[1.9rem]">
                                                {errors.province_code}
                                            </p>
                                        )}
                                        <span className="mb-2 font-[600] mt-8">Quận huyện</span>
                                        <div className="relative w-full h-full">
                                            <Select
                                                options={wards.map((w) => ({ value: w.code, label: w.name }))}
                                                onChange={(option) =>
                                                    handleInputChange({
                                                        target: { name: 'ward_code', value: option.value },
                                                    })
                                                }
                                                value={
                                                    wards
                                                        .map((w) => ({ value: w.code, label: w.name }))
                                                        .find((w) => w.value === formValues.ward_code) || null
                                                }
                                                className="w-full h-[4.5rem] text-2xl border border-gray-300 rounded-[5px] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                                                classNamePrefix="react-select"
                                                isDisabled={!formValues.province_code}
                                                menuPlacement="bottom"
                                                maxMenuHeight={200}
                                                placeholder="Select ward"
                                                styles={{
                                                    control: (base) => ({
                                                        ...base,
                                                        height: '4.5rem',
                                                        minHeight: '4.5rem',
                                                        fontSize: '1.5rem',
                                                        paddingLeft: '1.25rem',
                                                        paddingRight: '3rem',
                                                    }),
                                                    menu: (base) => ({
                                                        ...base,
                                                        zIndex: 10,
                                                    }),
                                                }}
                                            />
                                        </div>

                                        {errors.ward_code && (
                                            <p className="text-[var(--invalid-color)] font-semibold pt-[4px] text-[1rem] min-h-[1.9rem]">
                                                {errors.ward_code}
                                            </p>
                                        )}
                                        <span className="mb-2 font-[600] mt-8">Địa chỉ chi tiết</span>
                                        <Input
                                            type="text"
                                            name="address"
                                            onChange={handleInputChange}
                                            value={formValues.address}
                                            placeholder="House number, street name"
                                            error={errors.address}
                                            variant="register_login"
                                            errorClassName={'pt-[4px] text-[1rem] min-h-[1.9rem]'}
                                        />
                                        <Button type="submit" variant="auth" className="my-8">
                                            Hoàn tất đăng ký tài khoản
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
