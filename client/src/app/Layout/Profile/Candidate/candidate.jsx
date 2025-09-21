'use client';

import { useEffect, useState } from 'react';
import api from '@/app/api/axios';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import Button from '@/app/components/button.jsx';
import Header from '@/app/Layout/Header/Header';
import Footer from '@/app/Layout/Footer/Footer';
import validateField from '@/app/components/validatedInput';
import style from '@/app/Layout/Profile/Profile.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faList, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import showToast from '@/app/components/Toastify';

export default function CandidateProfile() {
    const { login, setLogin } = useAuth();
    const [profile, setProfile] = useState(null);
    const [errors, setErrors] = useState({});
    const router = useRouter();
    const params = useParams();
    const userId = params.user_id;

    const [formValues, setFormValues] = useState({
        full_name: '',
        email: '',
        phone: '',
        address: '',
        province_code: '',
        ward_code: '',
    });

    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);
    const [avatar, setAvatar] = useState(null);

    //Lay danh sach tinh thanh
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await api.get('/location/provinces');
                setProvinces(response.data.data);
            } catch (err) {
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
                    setErrors({ general: 'Không tải được quận huyện!' });
                }
            } else {
                setWards([]);
                setFormValues((prev) => ({ ...prev, ward_code: '' }));
            }
        };
        fetchWards();
    }, [formValues.province_code]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!login || !userId) return;

            try {
                const response = await api.get(`/user/profile/${userId}`);

                setProfile(response.data.data.candidate);
                setFormValues({
                    full_name: response.data.data.user.full_name || '',
                    email: response.data.data.user.email || '',
                    phone: response.data.data.candidate.phone || '',
                    address: response.data.data.candidate.address || '',
                    province_code: response.data.data.candidate.province_code || '',
                    ward_code: response.data.data.candidate.ward_code || '',
                });
                if (response.data.data.candidate?.avatar_path) {
                    setAvatar(`${process.env.NEXT_PUBLIC_API_URL}${response.data.data.candidate.avatar_path}`);
                }
            } catch (err) {
                setErrors({ general: 'Không tải được thông tin cá nhân!' });
            }
        };

        fetchProfile();
    }, [login, userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({
            ...prev,
            [name]: '',
        }));
    };

    const handleSelectChange = (name, value) => {
        setFormValues((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({
            ...prev,
            [name]: '',
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        newErrors.full_name = validateField('username', formValues.full_name);
        newErrors.email = validateField('email', formValues.email);

        if (formValues.phone.trim() && !/^[0-9]+$/.test(formValues.phone.trim())) {
            newErrors.phone = 'Số điện thoại không đúng định dạng';
        }

        if (formValues.province_code && !formValues.ward_code) {
            newErrors.ward_code = 'Vui lòng chọn quận huyện!';
        }

        const filteredErrors = Object.fromEntries(Object.entries(newErrors).filter(([_, value]) => value));

        return filteredErrors;
    };

    const handleFavouriteJobs = () => {
        router.push('/favourite-job');
    };

    const handleManageCV = () => {
        router.push('/manage-cv');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        console.log(profile);
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const formData = new FormData();
            Object.entries(formValues).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            if (avatar && typeof avatar === 'object') {
                formData.append('avatar', avatar);
            }

            console.log([...formData]);

            const response = await api.patch(`/user/profile/${userId}/patch`, formData);

            setProfile(response.data.data.candidate);
            setErrors({});
            showToast('success', 'Cập nhật thành công!');

            if (response.data.data.candidate?.avatar_path) {
                setAvatar(`${process.env.NEXT_PUBLIC_API_URL}${response.data.data.candidate.avatar_path}`);
            }
        } catch (err) {
            setErrors({
                general: err.response?.data?.errors?.error,
            });
            showToast('error', 'Cập nhật thất bại!');
        }
    };

    return (
        <>
            <Header login={login} setLogin={setLogin} />
            <div className="bg-[#f4f5f5]">
                <div className={style.container}>
                    <div className="flex flex-col gap-7 w-[75%]">
                        <div className="bg-white rounded-[10px] px-10 py-6 flex flex-col gap-7">
                            <h1 className="text-[20px] font-semibold">Thông tin cá nhân</h1>

                            <div className="w-full h-[1px] bg-[#E7E7E8]"></div>

                            <form onSubmit={handleSubmit} noValidate>
                                <div className="flex flex-col gap-1">
                                    <div className="flex flex-col gap-4">
                                        <span className="text-[14px] font-[500]">Họ và tên</span>
                                        <div className="relative w-full h-[4.5rem] border border-[#e9eaec] rounded-[5px] py-3 px-5 text-[16px]">
                                            <input
                                                type="text"
                                                name="full_name"
                                                value={formValues.full_name}
                                                onChange={handleInputChange}
                                                placeholder="Họ và tên của bạn"
                                                className="h-full w-[70%] outline-none"
                                            />
                                        </div>
                                    </div>

                                    {errors.full_name ? (
                                        <p className="text-[var(--invalid-color)] font-semibold pt-[4px] text-[1rem] min-h-[1.9rem]">
                                            {errors.full_name}
                                        </p>
                                    ) : (
                                        <div className="min-h-[1.9rem] w-full"></div>
                                    )}

                                    <div className="flex flex-col gap-4">
                                        <span className="text-[14px] font-[500]">Email</span>
                                        <div className="relative w-full h-[4.5rem] border border-[#e9eaec] rounded-[5px] py-3 px-5 text-[16px]">
                                            <input
                                                type="email"
                                                name="email"
                                                value={formValues.email}
                                                onChange={handleInputChange}
                                                placeholder="Email của bạn"
                                                className="h-full w-[70%] outline-none"
                                            />
                                        </div>
                                    </div>

                                    {errors.email ? (
                                        <p className="text-[var(--invalid-color)] font-semibold pt-[4px] text-[1rem] min-h-[1.9rem]">
                                            {errors.email}
                                        </p>
                                    ) : (
                                        <div className="min-h-[1.9rem] w-full"></div>
                                    )}

                                    <div className="flex flex-col gap-4">
                                        <span className="text-[14px] font-[500]">Số điện thoại</span>
                                        <div className="relative w-full h-[4.5rem] border border-[#e9eaec] rounded-[5px] py-3 px-5 text-[16px]">
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formValues.phone}
                                                onChange={handleInputChange}
                                                placeholder="Số điện thoại của bạn"
                                                className="h-full w-[70%] outline-none"
                                            />
                                        </div>
                                    </div>

                                    {errors.phone ? (
                                        <p className="text-[var(--invalid-color)] font-semibold pt-[4px] text-[1rem] min-h-[1.9rem]">
                                            {errors.phone}
                                        </p>
                                    ) : (
                                        <div className="min-h-[1.9rem] w-full"></div>
                                    )}

                                    <div className="flex flex-col gap-4 mb-7">
                                        <span className="text-[14px] font-[500]">Địa chỉ cụ thể</span>
                                        <div className="relative w-full h-[4.5rem] border border-[#e9eaec] rounded-[5px] py-3 px-5 text-[16px]">
                                            <input
                                                type="text"
                                                name="address"
                                                value={formValues.address}
                                                onChange={handleInputChange}
                                                placeholder="Địa chỉ của bạn"
                                                className="h-full w-[70%] outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between">
                                        <div className="flex flex-col">
                                            <span className="my-2 font-[500]">Tỉnh thành</span>
                                            <Select
                                                instanceId="province-select"
                                                options={provinces.map((p) => ({ value: p.code, label: p.name }))}
                                                onChange={(option) =>
                                                    handleSelectChange('province_code', option?.value || '')
                                                }
                                                value={
                                                    provinces
                                                        .map((p) => ({ value: p.code, label: p.name }))
                                                        .find((p) => p.value === formValues.province_code) || null
                                                }
                                                className="w-full h-[4.5rem] text-2xl border border-gray-300 rounded-[5px]"
                                                classNamePrefix="react-select"
                                                menuPlacement="bottom"
                                                maxMenuHeight={200}
                                                placeholder="Chọn tỉnh thành"
                                                isClearable
                                                styles={{
                                                    control: (base) => ({
                                                        ...base,
                                                        height: '4.5rem',
                                                        minHeight: '4.5rem',
                                                        fontSize: '1.5rem',
                                                        paddingLeft: '1.25rem',
                                                        paddingRight: '3rem',
                                                        width: '250px',
                                                    }),
                                                    menu: (base) => ({
                                                        ...base,
                                                        zIndex: 10,
                                                    }),
                                                }}
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="my-2 font-[500]">Quận huyện</span>
                                            <Select
                                                instanceId="ward-select"
                                                options={wards.map((w) => ({ value: w.code, label: w.name }))}
                                                onChange={(option) =>
                                                    handleSelectChange('ward_code', option?.value || '')
                                                }
                                                value={
                                                    wards
                                                        .map((w) => ({ value: w.code, label: w.name }))
                                                        .find((w) => w.value === formValues.ward_code) || null
                                                }
                                                className="w-full h-[4.5rem] text-2xl border border-gray-300 rounded-[5px]"
                                                classNamePrefix="react-select"
                                                isDisabled={!formValues.province_code}
                                                menuPlacement="bottom"
                                                maxMenuHeight={200}
                                                placeholder="Chọn quận huyện"
                                                isClearable
                                                styles={{
                                                    control: (base) => ({
                                                        ...base,
                                                        height: '4.5rem',
                                                        minHeight: '4.5rem',
                                                        fontSize: '1.5rem',
                                                        paddingLeft: '1.25rem',
                                                        paddingRight: '3rem',
                                                        width: '250px',
                                                    }),
                                                    menu: (base) => ({
                                                        ...base,
                                                        zIndex: 10,
                                                    }),
                                                }}
                                            />
                                            {errors.ward_code ? (
                                                <p className="text-[var(--invalid-color)] font-semibold pt-[4px] text-[1rem] min-h-[1.9rem]">
                                                    {errors.ward_code}
                                                </p>
                                            ) : (
                                                <div className="min-h-[1.9rem] w-[1px]"></div>
                                            )}
                                        </div>
                                    </div>

                                    <Button type="submit" variant="auth" className="my-8">
                                        Xác nhận thay đổi
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="flex flex-col gap-7 w-[25%]">
                        <div className="bg-white rounded-[10px] p-6 flex flex-col gap-7">
                            <div className="flex flex-col items-center w-full gap-7">
                                {/* Avatar */}
                                <div className="relative">
                                    <label htmlFor="avatar-upload" className="cursor-pointer">
                                        <img
                                            src={
                                                '/img/header/avatar/default-ava.jpg' // Đường dẫn ảnh mặc định
                                            }
                                            alt="Avatar"
                                            className="rounded-full object-cover  w-[120px] h-[120px]"
                                        />
                                        <div className="absolute bottom-0 right-[5px] bg-[var(--primary-color)] text-white px-2 rounded-full text-[18px]">
                                            <FontAwesomeIcon icon={faCamera} />
                                        </div>
                                    </label>
                                    {/* <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    /> */}
                                </div>

                                <div className="w-full h-[1px] bg-[#E7E7E8]"></div>

                                <h1 className="text-[16px] font-[500]">{profile?.full_name || ''}</h1>

                                <div className="flex flex-col gap-5 mt-2 w-full">
                                    <button
                                        onClick={handleFavouriteJobs}
                                        className="px-4 py-2 rounded-[5px] flex gap-3 items-center text-[14px] font-[400] cursor-pointer hover:bg-[#f2f4f5]"
                                    >
                                        <FontAwesomeIcon icon={faList} />
                                        <span>Việc làm yêu thích</span>
                                    </button>
                                    <button
                                        onClick={handleManageCV}
                                        className="px-4 py-2 rounded-[5px] flex gap-3 items-center text-[14px] font-[400] cursor-pointer hover:bg-[#f2f4f5]"
                                    >
                                        <FontAwesomeIcon icon={faLayerGroup} />
                                        <span>Quản lý hồ sơ </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
