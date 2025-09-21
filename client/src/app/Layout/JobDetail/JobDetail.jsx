'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import api from '@/app/api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFile,
    faPaperPlane,
    faHeart,
    faCalendar,
    faStar,
    faUser,
    faHandBackFist,
    faCompass,
    faShareFromSquare,
} from '@fortawesome/free-regular-svg-icons';
import { faLocationDot, faCoins, faClock, faXmark, faArrowsSpin } from '@fortawesome/free-solid-svg-icons';
import showToast from '@/app/components/Toastify';
import Header from '@/app/Layout/Header/Header';
import Footer from '@/app/Layout/Footer/Footer';
import SearchBar from '@/app/Layout/Main/TopSection/Search/searchBar';
import { useAuth } from '@/app/hooks/useAuth';
import validateField from '@/app/components/validatedInput';
import style from './jobDetail.module.css';

export default function JobDetail() {
    const { login, setLogin } = useAuth();
    const params = useParams();
    const jobId = params.job_id;
    const pathname = usePathname();

    const router = useRouter();
    const searchParams = useSearchParams();
    const [errors, setErrors] = useState({});
    const [user, setUser] = useState({});
    const [job, setJob] = useState(null);
    const [similarJobs, setSimilarJobs] = useState([]);
    const [isApplyPopupOpen, setIsApplyPopupOpen] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        file: null,
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userResponse = await api.get('/user/me');
                const response = await api.get(`/user/profile/${userResponse.data.data.user_id}`);
                setUser(response.data.data.candidate);
                setFormData((prev) => ({
                    ...prev,
                    full_name: response.data.data.candidate.full_name || '',
                    email: response.data.data.candidate.email || '',
                    phone: response.data.data.candidate.phone || '',
                }));
            } catch (err) {
                setErrors({ general: 'Lỗi khi lấy thông tin người dùng!' });
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch chi tiết công việc
                const jobResponse = await api.get(`/jobs/${jobId}`);
                setJob(jobResponse.data.data);

                // Fetch công việc liên quan
                const similarResponse = await api.get(`/jobs/related/${jobId}`);
                setSimilarJobs(similarResponse.data.data);
            } catch (err) {
                showToast('error', err.response?.data?.error);
                setJob(null);
                setSimilarJobs([]);
            }
        };

        fetchData();
    }, [jobId]);

    const formatSalary = (min, max) => {
        const format = (num) => (num / 1000000).toFixed(1).replace('.0', '') + ' triệu';
        if (min && max) return `${format(min)} - ${format(max)}`;
        if (min) return `Trên ${format(min)}`;
        return 'Thỏa thuận';
    };

    const formatDate = (deadline) => {
        const date = new Date(deadline);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatExperience = (experience) => {
        return experience.charAt(0).toUpperCase() + experience.slice(1);
    };

    const calculateDaysLeft = (deadline) => {
        const diffDays = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const validateForm = () => {
        const newErrors = {};

        newErrors.full_name = validateField('username', formData.full_name);
        newErrors.email = validateField('email', formData.email);

        if (formData.phone.trim() && !/^[0-9]+$/.test(formData.phone.trim())) {
            newErrors.phone = 'Số điện thoại không đúng định dạng';
        }

        const filteredErrors = Object.fromEntries(Object.entries(newErrors).filter(([_, value]) => value));

        return filteredErrors;
    };

    const handleApply = () => {
        setIsApplyPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsApplyPopupOpen(false);
        setFormData({
            full_name: user?.full_name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            file: null,
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({
            ...prev,
            [name]: '',
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
    };

    const handleViewFile = () => {
        if (formData.file) {
            const fileURL = URL.createObjectURL(formData.file);
            window.open(fileURL, '_blank');

            setTimeout(() => {
                URL.revokeObjectURL(fileURL);
            }, 1000);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('job_id', jobId);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('full_name', formData.full_name);
        formDataToSend.append('phone', formData.phone);

        if (formData.file) {
            formDataToSend.append('cv', formData.file);
        } else {
            showToast('error', 'Vui lòng upload file CV!');
            return;
        }

        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
        }

        try {
            const response = await api.post('/application', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            showToast('success', response.data.message);
            setIsApplyPopupOpen(false);
            setErrors({});
        } catch (err) {
            console.log(err);
            showToast('error', 'Lỗi khi ứng tuyển!');
        }
    };

    const handleSearch = ({ searchQuery, category_id, province_code, ward_code }) => {
        const queryParams = new URLSearchParams({
            query: searchQuery || '',
            category_id: category_id || '',
            province_code: province_code || '',
            ward_code: ward_code || '',
        });

        const currentParams = new URLSearchParams(searchParams.toString());
        queryParams.forEach((value, key) => {
            if (value) currentParams.set(key, value);
            else currentParams.delete(key);
        });

        //Chuyen huong
        const url = `/search?${currentParams.toString()}`;
        if (pathname === '/search') {
            router.replace(url);
        } else {
            router.push(url);
        }
    };

    const handleViewCompany = () => {
        if (job?.company_id) {
            router.push(`/company/${job.company_id}`);
        }
    };

    if (!job) {
        return (
            <>
                <Header login={login} setLogin={setLogin} />
                <div className="container mx-auto py-10 text-center">
                    <p className="text-lg text-red-500">Công việc không tồn tại!</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header login={login} setLogin={setLogin} />
            <div className={style.searchBarContainer}>
                <div className={style.overlay}>
                    <SearchBar onSearch={handleSearch} />
                </div>
            </div>
            <div className="bg-[#f4f5f5]">
                <div className={style.container}>
                    <div className="w-[70%] flex flex-col gap-7">
                        <div className="bg-white rounded-[10px] px-8 py-6 flex flex-col gap-8">
                            <h1 className="text-[22px] font-semibold">{job.title}</h1>
                            <div className="flex gap-25">
                                <div className="flex gap-5 items-center">
                                    <img src="/img/icon/icon-coin.png" alt="coin" className="h-[35px]" />
                                    <div className="flex flex-col gap-3">
                                        <span className="text-[12px]">Mức lương</span>
                                        <span className="text-[12px] font-semibold">
                                            {formatSalary(job.min_salary, job.max_salary)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-5 items-center">
                                    <img src="/img/icon/icon-schedual.png" alt="schedual" className="h-[35px]" />
                                    <div className="flex flex-col gap-3">
                                        <span className="text-[12px]">Hạn nộp hồ sơ</span>
                                        <span className="text-[12px] font-semibold">{formatDate(job.deadline)}</span>
                                    </div>
                                </div>
                                <div className="flex gap-5 items-center">
                                    <img src="/img/icon/icon-map.png" alt="map" className="h-[35px]" />
                                    <div className="flex flex-col gap-3">
                                        <span className="text-[12px]">Địa điểm</span>
                                        <span className="text-[12px] font-semibold">{job.province_name}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="inline-block bg-[#fff7ed] text-[12px] text-[#EA580C] px-2 py-1 rounded font-[500]">
                                    <FontAwesomeIcon icon={faFile} className="text-[#EA580C] mr-3" />

                                    {job.required_cv ? `Công việc này yêu cầu CV!` : `Công việc này không yêu cầu CV!`}
                                </span>
                            </div>
                            <div className="flex items-center gap-5 ">
                                <button
                                    className="bg-[var(--primary-color)] rounded-[5px] text-white font-[14px] font-semibold px-6 py-3 flex-1 cursor-pointer hover:opacity-80"
                                    onClick={handleApply}
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} className="mr-3" />
                                    Ứng tuyển ngay
                                </button>
                                <button
                                    // onClick={''}
                                    className="rounded-[5px] font-semibold px-6 py-3 font-[14px] border border-[var(--primary-color)] text-[var(--primary-color)] cursor-pointer hover:opacity-80"
                                >
                                    <FontAwesomeIcon icon={faHeart} className="mr-3" />
                                    Lưu tin
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-[10px] px-8 py-6 flex flex-col gap-8">
                            <div className="flex items-center gap-3">
                                <div className="w-[5px] bg-[var(--primary-color)] h-[24px]"></div>
                                <h1 className="font-semibold text-[20px]">Chi tiết tuyển dụng</h1>
                            </div>

                            <div className="bg-[#fff7ed] rounded-[5px] px-[16px] py-[20px] flex flex-col gap-7">
                                <div className="flex items-center pb-[18px] border-b border-[var(--primary-color)]/30">
                                    <div className="flex items-center gap-5 w-[50%]">
                                        <div className="flex items-center">
                                            <div className="px-4 py-2 rounded-full bg-[#EA580C]/10 h-[32px] w-[32px] flex items-center justify-center">
                                                <FontAwesomeIcon
                                                    icon={faCalendar}
                                                    className="text-[#EA580C] text-[18px]"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 text-[12px]">
                                            <span>Ngày đăng</span>
                                            <span className="font-[500]">{formatDate(job.created_at)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-5 w-[50%]">
                                        <div className="flex items-center">
                                            <div className="px-4 py-2 rounded-full bg-[#EA580C]/10 h-[32px] w-[32px] flex items-center justify-center">
                                                <FontAwesomeIcon icon={faStar} className="text-[#EA580C] text-[18px]" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 text-[12px]">
                                            <span>Cấp bậc</span>
                                            <span className="font-[500]">{formatExperience(job.experience)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center ">
                                    <div className="flex items-center gap-5 w-[50%]">
                                        <div className="flex items-center">
                                            <div className="px-4 py-2 rounded-full bg-[#EA580C]/10 h-[32px] w-[32px] flex items-center justify-center">
                                                <FontAwesomeIcon icon={faUser} className="text-[#EA580C] text-[18px]" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 text-[12px]">
                                            <span>Số lượng tuyển</span>
                                            <span className="font-[500]">{job.limited}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-5 w-[50%]">
                                        <div className="flex items-center">
                                            <div className="px-4 py-2 rounded-full bg-[#EA580C]/10 h-[32px] w-[32px] flex items-center justify-center">
                                                <FontAwesomeIcon
                                                    icon={faHandBackFist}
                                                    className="text-[#EA580C] text-[18px]"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 text-[12px]">
                                            <span>Ngành nghề</span>
                                            <span className="font-[500]">{job.category_name}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 mt-4">
                                <h2 className="text-[18px] font-semibold">Mô tả công việc</h2>
                                <p className="text-[14px]">{job.description}</p>
                            </div>

                            <div className="flex flex-col gap-4 mt-4">
                                <h2 className="text-[18px] font-semibold">Yêu cầu ứng viên</h2>
                                <p className="text-[14px]">{job.requirement}</p>
                            </div>

                            <div className="flex flex-col gap-4 mt-4">
                                <h2 className="text-[18px] font-semibold">Quyền lợi</h2>
                                <p className="text-[14px]">{job.benefit}</p>
                            </div>

                            <div className="flex flex-col gap-4 mt-4">
                                <h2 className="text-[18px] font-semibold">Địa điểm làm việc</h2>
                                <div className="flex items-center gap-3">
                                    <FontAwesomeIcon
                                        icon={faCompass}
                                        className=" text-[16px] text-[var(--primary-color)]"
                                    />
                                    <p className="text-[14px]">{`${job.address}, ${job.ward_name}, ${job.province_name}`}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-5 ">
                                <button
                                    className="bg-[var(--primary-color)] rounded-[5px] text-white font-[14px] font-semibold px-6 py-3 flex-1 cursor-pointer hover:opacity-80"
                                    onClick={handleApply}
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} className="mr-3" />
                                    Ứng tuyển ngay
                                </button>
                                <button
                                    // onClick={''}
                                    className="rounded-[5px] font-semibold px-6 py-3 font-[14px] border border-[var(--primary-color)] text-[var(--primary-color)] cursor-pointer hover:opacity-80"
                                >
                                    <FontAwesomeIcon icon={faHeart} className="mr-3" />
                                    Lưu tin
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="w-[30%] flex flex-col gap-7">
                        <div className="bg-white rounded-[10px] px-8 py-6 flex flex-col gap-8 items-center">
                            <img src={job.logo_path} alt="logo" className="rounded-[10px] w-[70px]" />
                            <p className="text-[18px] font-[500]">{job.company_name}</p>
                            <div className="">
                                <span className="font-semibold mr-1">Địa chỉ: </span>
                                {`${job.address}, ${job.ward_name}, ${job.province_name}`}
                            </div>
                            <button
                                onClick={handleViewCompany}
                                className="flex items-center gap-3 text-[var(--primary-color)] cursor-pointer hover:underline"
                            >
                                <p>Xem trang công ty</p>
                                <FontAwesomeIcon icon={faShareFromSquare} />
                            </button>
                        </div>

                        {similarJobs.length > 0 && (
                            <div className="bg-white rounded-[10px] px-8 py-6 flex flex-col gap-8 ">
                                <h1 className="font-semibold text-[16px] text-center">Việc làm tương tự</h1>
                                <div className="flex flex-col gap-5 ">
                                    {similarJobs.map((job) => (
                                        <Link href={`/jobs/${job.job_id}`} key={job.job_id}>
                                            <div className="border border-[#E7E7E8] hover:border-[var(--primary-color)] rounded-[5px] p-3 flex flex-col gap-4 relative">
                                                <div className="w-[80%]">
                                                    <p className="text-[14px] text-[#414045] line-clamp-2 font-[500]">
                                                        {job.title}
                                                    </p>
                                                    <button className="absolute right-[5px] top-[3px] text-[16px]">
                                                        <FontAwesomeIcon icon={faHeart} />
                                                    </button>
                                                </div>
                                                <div className="flex gap-5">
                                                    <img
                                                        src={job.logo_path}
                                                        alt="logo"
                                                        className="w-[50px] h-[50px] rounded-[5px]"
                                                    />
                                                    <div className="flex flex-col gap-2">
                                                        <p className="text-[var(--text-color)] text-[12px] font-[500] line-clamp-1">
                                                            {job.company_name}
                                                        </p>
                                                        <div className="flex items-center gap-2 text-[12px]">
                                                            <FontAwesomeIcon
                                                                icon={faCoins}
                                                                className="text-[#939295]"
                                                            />
                                                            <span className=" text-[var(--primary-color)] font-[500]">
                                                                {formatSalary(job.min_salary, job.max_salary)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-[12px]">
                                                            <FontAwesomeIcon
                                                                icon={faLocationDot}
                                                                className="text-[#939295]"
                                                            />
                                                            <span className="font-[500]">{job.province_name}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-full h-[1px] bg-[#E7E7E8]"></div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-5">
                                                        <div className="bg-[#e3faed]/80 py-2 px-2 text-[10px] text-[var(--recuitment-color)] text-center w-[75px] rounded font-semibold">
                                                            <span>{formatExperience(job.experience)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 items-center">
                                                        <FontAwesomeIcon
                                                            icon={faClock}
                                                            className="text-gray-400 w-4 h-6 mb-[0.5px]"
                                                        />
                                                        <span className="text-[10px] font-medium ">
                                                            Còn {calculateDaysLeft(job.deadline)} ngày
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Form ứng tuyển */}

                    {isApplyPopupOpen && (
                        <div
                            className="fixed inset-0 bg-black flex items-center justify-center z-50"
                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                            onClick={handleClosePopup}
                        >
                            <div
                                className="bg-white rounded-[15px] h-[600px] w-[550px] relative flex flex-col"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    className="absolute top-[12px] right-[20px] hover:opacity-70 text-[20px] cursor-pointer"
                                    type="button"
                                    onClick={handleClosePopup}
                                >
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                                <div className="pl-[35px] py-[16px] pr-[65px] border-b border-[#efeff0] flex flex-col gap-3">
                                    <h2 className="text-[16px] font-semibold">Ứng tuyển vào vị trí</h2>
                                    <div className="flex gap-5 items-center">
                                        <img
                                            src={job.logo_path}
                                            alt="logo"
                                            className="w-[45px] h-[45px] rounded-[5px]"
                                        />
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[14px] font-semibold line-clamp-1 ">{job.title}</p>
                                            <p className="text-[14px] line-clamp-1 text-[#939295]">
                                                {job.company_name}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="px-[35px] py-[14px] flex-1 gap-2 flex flex-col">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[12px] font-[500]">
                                                Họ và tên <span className="text-[#ff0000]">*</span>
                                            </span>
                                            <div className="relative w-full border border-[#e9eaec] rounded-[5px] py-3 px-5 text-[14px]">
                                                <input
                                                    type="text"
                                                    name="full_name"
                                                    value={formData.full_name}
                                                    onChange={handleInputChange}
                                                    placeholder="Họ và tên"
                                                    className=" w-[90%] outline-none"
                                                />
                                            </div>
                                        </div>

                                        {errors.full_name ? (
                                            <p className="text-[var(--invalid-color)] font-semibold pt-[4px] text-[10px] min-h-[1.3rem]">
                                                {errors.full_name}
                                            </p>
                                        ) : (
                                            <div className="min-h-[1.3rem] w-full"></div>
                                        )}

                                        <div className="flex flex-col gap-2">
                                            <span className="text-[12px] font-[500]">
                                                Email <span className="text-[#ff0000]">*</span>
                                            </span>
                                            <div className="relative w-full border border-[#e9eaec] rounded-[5px] py-3 px-5 text-[14px]">
                                                <input
                                                    type="text"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="Email của bạn"
                                                    className=" w-[90%] outline-none"
                                                />
                                            </div>
                                        </div>

                                        {errors.email ? (
                                            <p className="text-[var(--invalid-color)] font-semibold pt-[4px] text-[10px] min-h-[1.3rem]">
                                                {errors.email}
                                            </p>
                                        ) : (
                                            <div className="min-h-[1.3rem] w-full"></div>
                                        )}

                                        <div className="flex flex-col gap-2">
                                            <span className="text-[12px] font-[500]">
                                                Số điện thoại <span className="text-[#ff0000]">*</span>
                                            </span>
                                            <div className="relative w-full border border-[#e9eaec] rounded-[5px] py-3 px-5 text-[14px]">
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="Số điện thoại của bạn"
                                                    className=" w-[90%] outline-none"
                                                />
                                            </div>
                                        </div>

                                        {errors.phone ? (
                                            <p className="text-[var(--invalid-color)] font-semibold pt-[4px] text-[10px] min-h-[1.3rem]">
                                                {errors.phone}
                                            </p>
                                        ) : (
                                            <div className="min-h-[1.3rem] w-full"></div>
                                        )}

                                        <div className="flex flex-col gap-2">
                                            <span className="text-[12px] font-[500]">
                                                CV ứng tuyển <span className="text-[#ff0000]">*</span>
                                            </span>
                                            <div
                                                className="relative w-full border-2 border-dashed border-[#e9eaec] rounded-[8px] py-6 px-5 text-center bg-[#f8f9fa]"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <input
                                                    type="file"
                                                    accept=".doc,.docx,.pdf"
                                                    onChange={handleFileChange}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    ref={(input) => {
                                                        window.fileInput = input;
                                                    }}
                                                    required
                                                />

                                                {/* Hiển thị khi đã chọn file */}
                                                {formData.file ? (
                                                    <div className="relative flex items-center justify-between p-3 bg-white border border-[#e9eaec] rounded-[8px]">
                                                        <div className="flex items-center gap-3">
                                                            <div className="text-left">
                                                                <p className="text-[14px] font-[500] text-gray-800 line-clamp-1">
                                                                    {formData.file.name}
                                                                </p>
                                                                <p className="text-[12px] text-gray-500">
                                                                    Đã tải lên {new Date().toLocaleDateString('vi-VN')}{' '}
                                                                    •{' '}
                                                                    {new Date().toLocaleTimeString('vi-VN', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                    })}
                                                                </p>
                                                                <button
                                                                    className="text-[12px] text-[var(--primary-color)] hover:underline cursor-pointer"
                                                                    onClick={handleViewFile}
                                                                    type="button"
                                                                >
                                                                    Xem hồ sơ
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <button
                                                            className="cursor-pointer absolute right-[15px] top-[6px] text-[17px] text-[var(--primary-color)] hover:opcaity-70"
                                                            onClick={() => window.fileInput?.click()}
                                                            type="button"
                                                        >
                                                            <FontAwesomeIcon icon={faArrowsSpin} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    // Hiển thị khi chưa chọn file
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="flex items-center gap-2 text-[var(--primary-color)]">
                                                            <svg
                                                                className="w-6 h-6"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                                />
                                                            </svg>
                                                            <span className="text-[14px] font-[500]">
                                                                Tải lên CV có sẵn
                                                            </span>
                                                        </div>
                                                        <span className="text-[12px] text-[#6b7280]">
                                                            Hỗ trợ định dạng: doc, docx, pdf, tối đa 5MB
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="mt-8 rounded-[5px] w-full bg-[var(--primary-color)] text-white py-4 text-center cursor-pointer hover:opacity-80 font-semibold text-[14px]"
                                        >
                                            Ứng tuyển ngay
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
                <Footer />
            </div>
        </>
    );
}
