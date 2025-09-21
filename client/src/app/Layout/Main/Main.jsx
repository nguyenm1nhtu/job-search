'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import api from '@/app/api/axios';
import style from './Main.module.css';
import SearchBar from './TopSection/Search/searchBar.jsx';
import Carousel from './TopSection/Carousel/carousel.jsx';
import Body from './Body/Body.jsx';

export default function Main() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const images = ['/img/body/pic1.jpg', '/img/body/pic2.jpg', '/img/body/pic3.jpg', '/img/body/pic4.jpg'];
    const [immediatelyJobs, setImmediatelyJobs] = useState([]);
    const [urgentJobs, setUrgentJobs] = useState([]);
    const [anotherJobs, setAnotherJobs] = useState([]);
    const [error, setError] = useState(null);

    // Hàm tính số ngày còn lại đến deadline
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

    const formatJob = (job) => ({
        ...job,
        position: job.title,
        logo: job.logo_path,
        company: job.company_name,
        salary: formatSalary(job.min_salary, job.max_salary),
        location: job.ward_name ? `${job.province_name}, ${job.ward_name}` : job.province_name,
        requiredCV: job.required_cv,
        time: calculateDaysLeft(job.deadline),
    });

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get('/jobs', { params: { status: 'open' } });
                const jobs = response.data.data;

                // Loc loai cong viec
                const immediate = jobs.filter((job) => calculateDaysLeft(job.deadline) <= 7).map(formatJob);
                const urgent = jobs
                    .filter((job) => calculateDaysLeft(job.deadline) > 7 && calculateDaysLeft(job.deadline) <= 30)
                    .map(formatJob);
                const others = jobs.filter((job) => calculateDaysLeft(job.deadline) > 30).map(formatJob);

                setImmediatelyJobs(immediate);
                setUrgentJobs(urgent);
                setAnotherJobs(others);
            } catch (err) {
                setError('Không tải được danh sách việc làm!');
            }
        };
        fetchJobs();
    }, []);

    // Hàm xử lý tìm kiếm
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

    return (
        <>
            <div className={style.container}>
                <div className="h-[480px] w-full relative">
                    <Image src="/img/body/background.jpg" alt="Background Image" fill className="object-fit" priority />

                    <div className={style.overlay}>
                        <SearchBar onSearch={handleSearch} />
                        <Carousel images={images} />
                    </div>
                </div>

                <div className={style.body}>
                    <Body title="Việc đi làm ngay" jobs={immediatelyJobs} />
                    <Body title="Việc làm gấp" jobs={urgentJobs} className="bg-[#fff3ed]" />
                    <Body title="Việc làm khác" jobs={anotherJobs} />
                </div>
            </div>
        </>
    );
}
