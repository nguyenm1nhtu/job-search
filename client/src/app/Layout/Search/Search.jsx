'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/app/api/axios';
import SearchBar from '@/app/Layout/Main/TopSection/Search/searchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFilter,
    faLocationDot,
    faClock,
    faAngleRight,
    faAngleLeft,
    faCoins,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import style from './search.module.css';
import { toast } from 'react-toastify';
import { useAuth } from '@/app/hooks/useAuth';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Select from 'react-select';
import ReactPaginate from 'react-paginate';
import Link from 'next/link';

export default function Search() {
    const { login, setLogin } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [jobs, setJobs] = useState([]);
    const [filters, setFilters] = useState({
        query: '',
        category_id: '',
        province_code: '',
        ward_code: '',
        min_salary: '',
        experience: '',
        required_cv: '',
        sort_by: 'updated_at_desc',
    });
    const [currentPage, setCurrentPage] = useState(0);
    const jobsPerPage = 10;

    useEffect(() => {
        const params = {
            query: searchParams.get('query') || '',
            category_id: searchParams.get('category_id') || '',
            province_code: searchParams.get('province_code') || '',
            ward_code: searchParams.get('ward_code') || '',
            min_salary: searchParams.get('min_salary') || '',
            experience: searchParams.get('experience') || '',
            required_cv: searchParams.get('required_cv') || '',
            sort_by: searchParams.get('sort_by') || 'updated_at_desc',
        };
        setFilters(params);
    }, [searchParams]);

    // Fetch jobs khi filters thay đổi
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                console.log('Fetching jobs with params:', filters);
                const response = await api.get('/jobs', { params: filters });
                if (response.data && Array.isArray(response.data.data)) {
                    setJobs(response.data.data);
                } else {
                    console.error('Invalid response format:', response.data);
                    setJobs([]);
                    toast.error('Dữ liệu việc làm không hợp lệ!');
                }
                setCurrentPage(0);
            } catch (err) {
                console.error('Error fetching jobs:', {
                    message: err.message,
                    status: err.response?.status,
                    data: err.response?.data,
                    params: filters,
                });
                setJobs([]);
                toast.error('Không tải được danh sách việc làm! Vui lòng thử lại.');
            }
        };
        fetchJobs();
    }, [filters]);

    // Cập nhật URL khi filters thay đổi
    useEffect(() => {
        const queryParams = new URLSearchParams({
            query: filters.query || '',
            category_id: filters.category_id || '',
            province_code: filters.province_code || '',
            ward_code: filters.ward_code || '',
            ...(filters.min_salary && { min_salary: filters.min_salary }),
            ...(filters.experience && { experience: filters.experience }),
            ...(filters.required_cv && { required_cv: filters.required_cv }),
            sort_by: filters.sort_by,
        });
        router.push(`/search?${queryParams.toString()}`, { scroll: false });
    }, [filters, router]);

    const handleSearch = ({ searchQuery, category_id, province_code, ward_code }) => {
        setFilters((prev) => ({
            ...prev,
            query: searchQuery,
            category_id,
            province_code,
            ward_code,
        }));
    };

    const handleFilterChange = (filterType, value) => {
        setFilters((prev) => {
            let updated = { ...prev };
            if (filterType === 'experience') {
                const levels = updated.experience ? updated.experience.split(',').filter(Boolean) : [];
                updated.experience = levels.includes(value)
                    ? levels.filter((item) => item !== value).join(',')
                    : [...levels, value].join(',');
                updated.experience = updated.experience || '';
            } else if (filterType === 'required_cv') {
                if (updated.required_cv === value) {
                    updated.required_cv = '';
                } else {
                    updated.required_cv = value;
                }
            } else if (filterType === 'salary_range') {
                updated.min_salary = updated.min_salary === value ? '' : value;
            } else if (filterType === 'sort_by') {
                updated.sort_by = value;
            }
            return updated;
        });
    };

    const salaryRanges = [
        { label: 'Trên 10 triệu', value: '10000000' },
        { label: 'Trên 15 triệu', value: '15000000' },
        { label: 'Trên 20 triệu', value: '20000000' },
        { label: 'Trên 30 triệu', value: '30000000' },
        { label: 'Trên 50 triệu', value: '50000000' },
    ];

    const sortOptions = [
        { value: 'updated_at_desc', label: 'Ngày cập nhật' },
        { value: 'salary_asc', label: 'Lương thấp đến cao' },
        { value: 'salary_desc', label: 'Lương cao đến thấp' },
    ];

    const calculateDaysLeft = (deadline) => {
        const diffDays = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const formatSalary = (min, max) => {
        const format = (num) => (num / 1000000).toFixed(1).replace('.0', '') + ' triệu';
        if (min && max) return `${format(min)} - ${format(max)}`;
        if (min) return `Trên ${format(min)}`;
        return 'Thỏa thuận';
    };

    const formatExperience = (experience) => {
        return experience.charAt(0).toUpperCase() + experience.slice(1);
    };

    const currentJobs = jobs.slice(currentPage * jobsPerPage, (currentPage + 1) * jobsPerPage);
    const pageCount = Math.ceil(jobs.length / jobsPerPage);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <Header login={login} setLogin={setLogin} />
            <div className={style.searchBarContainer}>
                <div className={style.overlay}>
                    <SearchBar onSearch={handleSearch} />
                </div>
            </div>
            <div className={style.container}>
                <div className="w-1/4 flex flex-col">
                    <div className="flex gap-4 font-semibold items-center py-5 border-b border-gray-300">
                        <FontAwesomeIcon icon={faFilter} className="text-[20px] text-[var(--primary-color)]" />
                        <span className="text-[18px]">Lọc nâng cao</span>
                    </div>
                    <div className="mt-6">
                        <span className="text-[14px] font-semibold">Theo mức lương</span>
                        <ul>
                            {salaryRanges.map((range) => (
                                <li key={range.value}>
                                    <label className="flex items-center gap-4 mt-2">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 accent-[var(--primary-color)]"
                                            checked={filters.min_salary === range.value}
                                            onChange={() => handleFilterChange('salary_range', range.value)}
                                        />
                                        <span className="text-[14px]">{range.label}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-6">
                        <span className="text-[14px] font-semibold">Theo kinh nghiệm</span>
                        <ul>
                            {['junior', 'mid', 'senior', 'lead'].map((level) => (
                                <li key={level}>
                                    <label className="flex items-center gap-4 mt-2">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 accent-[var(--primary-color)]"
                                            checked={filters.experience.includes(level)}
                                            onChange={() => handleFilterChange('experience', level)}
                                        />
                                        <span className="text-[14px]">
                                            {level.charAt(0).toUpperCase() + level.slice(1)}
                                        </span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-6">
                        <span className="text-[14px] font-semibold">Theo yêu cầu CV</span>
                        <ul>
                            {['true', 'false'].map((cv) => (
                                <li key={cv}>
                                    <label className="flex items-center gap-4 mt-2">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 accent-[var(--primary-color)]"
                                            checked={filters.required_cv === cv}
                                            onChange={() => handleFilterChange('required_cv', cv)}
                                        />
                                        <span className="text-[14px]">
                                            {cv === 'true' ? 'Yêu cầu CV' : 'Không yêu cầu CV'}
                                        </span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="w-3/4 flex flex-col">
                    <div className="flex justify-end items-center py-5">
                        <div className="flex items-center gap-4">
                            <span>Sắp xếp theo:</span>
                            <Select
                                instanceId="sort-select"
                                options={sortOptions}
                                value={sortOptions.find((option) => option.value === filters.sort_by)}
                                onChange={(selected) => handleFilterChange('sort_by', selected.value)}
                                className="w-[250px]"
                                isSearchable={false}
                                styles={{
                                    control: (provided, state) => ({
                                        ...provided,
                                        borderColor: 'gray',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        boxShadow: state.isFocused ? 'none' : provided.boxShadow,
                                        '&:hover': {
                                            borderColor: 'var(--primary-color)',
                                        },
                                    }),
                                    option: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.isSelected ? 'var(--primary-color)' : 'white',
                                        color: state.isSelected ? 'white' : 'black',
                                        cursor: 'pointer',
                                        '&:hover': { backgroundColor: 'var(--primary-color)', color: 'white' },
                                    }),
                                }}
                            />
                        </div>
                    </div>
                    <div className={style.jobContainer}>
                        <div className="grid grid-cols-1 gap-6">
                            {currentJobs.map((job) => (
                                <Link href={`/jobs/${job.job_id}`} key={job.job_id}>
                                    <div className="flex flex-col rounded-lg bg-white border border-gray-200 hover:border-[var(--primary-color)] relative p-4 gap-2">
                                        <div className="flex gap-6">
                                            <img
                                                src={job.logo_path || '/default-logo.png'}
                                                alt="logo"
                                                className="w-30 h-30 rounded-lg object-contain"
                                            />
                                            <div className="flex flex-col gap-2">
                                                <p className="text-[16px] font-medium">{job.title}</p>
                                                <h3 className="text-[12px] text-[var(--text-color)] line-clamp-1 font-[500]">
                                                    {job.company_name}
                                                </h3>
                                                <div className="flex items-center gap-14">
                                                    <div className="flex items-center gap-2">
                                                        <FontAwesomeIcon
                                                            icon={faCoins}
                                                            className="text-[#939295] w-[16px] h-[22px]"
                                                        />
                                                        <span className="text-[12px] text-[var(--primary-color)] font-[500]">
                                                            {formatSalary(job.min_salary, job.max_salary)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <FontAwesomeIcon
                                                            icon={faLocationDot}
                                                            className="text-[#939295] w-[16px] h-[22px]"
                                                        />
                                                        <span className="text-[12px] font-[500]">
                                                            {`${job.ward_name}, ${job.province_name}`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full h-px bg-gray-200 my-1"></div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-5">
                                                <div className="bg-[#e3faed]/80 py-2 px-2 text-[10px] text-[var(--recuitment-color)] text-center w-[75px] rounded font-semibold">
                                                    <span>{formatExperience(job.experience)}</span>
                                                </div>
                                                <div>
                                                    {!job.required_cv && (
                                                        <div className="bg-blue-100 py-2 px-4 text-[10px] text-blue-600 rounded font-semibold">
                                                            Không cần CV
                                                        </div>
                                                    )}
                                                    {job.required_cv && <div className="w-24 h-0"></div>}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <FontAwesomeIcon
                                                    icon={faClock}
                                                    className="text-gray-400 w-4 h-6 mb-[0.5px]"
                                                />
                                                <span className="text-[12px] font-medium ">
                                                    Còn {calculateDaysLeft(job.deadline)} ngày
                                                </span>
                                            </div>
                                        </div>
                                        <div className="absolute top-3 right-4">
                                            <FontAwesomeIcon icon={faHeart} className="text-[16px]" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        {jobs.length > 0 && (
                            <div className="mt-6 flex justify-center">
                                <ReactPaginate
                                    previousLabel={<FontAwesomeIcon icon={faAngleLeft} />}
                                    nextLabel={<FontAwesomeIcon icon={faAngleRight} />}
                                    pageCount={pageCount}
                                    onPageChange={handlePageChange}
                                    breakLabel="..."
                                    containerClassName="flex items-center justify-center gap-3"
                                    activeClassName="border border-[var(--primary-color)] text-[var(--primary-color)]"
                                    pageClassName="w-10 h-10 rounded-full border hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] cursor-pointer"
                                    pageLinkClassName="flex items-center justify-center w-full h-full"
                                    previousClassName="flex items-center justify-center w-10 h-10 rounded-full border cursor-pointer hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] mx-2"
                                    previousLinkClassName="flex items-center justify-center w-full h-full"
                                    nextClassName="flex items-center justify-center w-10 h-10 rounded-full border cursor-pointer hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] mx-2"
                                    nextLinkClassName="flex items-center justify-center w-full h-full"
                                    breakClassName="flex items-center justify-center w-10 h-10"
                                    breakLinkClassName="text-gray-500"
                                    disabledClassName="opacity-50"
                                    renderOnZeroPageCount={null}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
