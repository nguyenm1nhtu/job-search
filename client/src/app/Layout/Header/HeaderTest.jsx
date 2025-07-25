'use client';

import { useState, useRef, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Loading from '@/app/components/loading/loading';
import style from './Header.module.css';
import Input from '@/app/components/input';
import clsx from 'clsx';
import Button from '@/app/components/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faListUl,
    faLocationDot,
    faMagnifyingGlass,
    faAngleRight,
    faAngleLeft,
} from '@fortawesome/free-solid-svg-icons';
import provinces from '@/app/data/provinces.json';
import useClickOutside from '@/app/components/closeDropdown';

export default function Header() {
    const [isLoading, setIsLoading] = useState(false);
    const [openCategory, setCategoryOpen] = useState(false);
    const [openLocation, setLocationOpen] = useState(false);
    const [districtCategory, setDistrictCategory] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedJob, setSelectedJob] = useState([]);

    let listOfPopularJob = [
        'Marketing',
        'Thư ký',
        'IT - Phần cứng',
        'IT - Phần mềm',
        'Giáo viên',
        'Luật sư',
        'Chăm sóc y tế',
    ];
    let listOfOtherJob = [
        'Truyền thông',
        'Quản lý KOL',
        'Bảo vệ - An ninh',
        'Viễn thông',
        'Bán sỉ - Bản lẻ',
        'Lái xe - Giao nhận',
    ];

    const handleLocationClick = (value) => {
        if (value === 'back') {
            setDistrictCategory(false);
            setSelectedProvince('');
            setSelectedDistrict('');
        } else if (!districtCategory) {
            if (value === '000') {
                setDistrictCategory(false);
                setLocationOpen(false);
                console.log(`Đã chọn toàn quốc: ${value}`);
            } else {
                setDistrictCategory(true);
            }
            setSelectedProvince(value);
            setSelectedDistrict('');
            console.log(`Đã chọn tỉnh thành: ${value}`);
        } else {
            setSelectedDistrict(value);
            setLocationOpen(false);
            console.log(`Đã chọn quận/huyện: ${value}`);
        }
    };

    const handleJobSelection = (job) => {
        setSelectedJob((prev) => (prev.includes(job) ? prev.filter((item) => item != job) : [...prev, job]));
    };

    useEffect(() => {
        console.log('Danh sách nghề đã chọn:', selectedJob);
    }, [selectedJob]);

    const categoryRef = useClickOutside(() => setCategoryOpen(false));
    const locationRef = useClickOutside(() => setLocationOpen(false));

    return (
        <>
            {isLoading && <Loading />}
            <header className={style.header}>
                <Link href="/" className="text-[3rem] text-black cursor-pointer font-semibold pr-[2rem] select-none">
                    <p style={{ fontFamily: 'iconFont, sans-serif' }}>BotCV</p>
                </Link>

                {/* Search Bar */}

                <div className="w-[840px] h-[50px] rounded-[15px] border-2 border-[#e8e8e8]">
                    <form className="flex w-full h-full py-[6px] px-[10px] select-none">
                        {/* Search text */}

                        <input
                            type="text"
                            className="flex-1 text-[13px] border-none outline-none"
                            style={{ padding: '0 8px 0 8px' }}
                            placeholder="Công việc hoặc tên công ty cần tìm..."
                        />

                        <div className={style.divider}></div>

                        {/* Search categories */}

                        <div
                            className="w-[25%] flex items-center cursor-pointer rounded-[20px] relative px-[8px]"
                            ref={categoryRef}
                        >
                            <div
                                className=" flex items-center gap-[10px] hover:bg-[#f2f4f5] px-[10px] flex-[1] rounded-[20px] h-full"
                                onClick={() => setCategoryOpen(!openCategory)}
                            >
                                <FontAwesomeIcon icon={faListUl} className="w-5 h-5" />
                                <span className="text-[12px]">Danh Mục Nghề</span>
                                {selectedJob.length > 0 ? (
                                    <span
                                        className="rounded-[10px] bg-[#ccc] flex items-center justify-center ml-[2px] text-[10px] truncate"
                                        style={{
                                            backgroundColor: 'rgb(230, 230, 230)',
                                            padding: '3px 6px 3px 6px',
                                        }}
                                    >
                                        +{selectedJob.length}
                                    </span>
                                ) : (
                                    ''
                                )}
                            </div>

                            {/* Categories */}
                            {openCategory && (
                                <div
                                    className="w-full absolute max-h-[300px] bg-white z-[1] pb-5 left-0 rounded-[5px] overflow-y-auto"
                                    style={{
                                        boxShadow:
                                            'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 4px 11px',
                                        top: 'calc(100% + 8px)',
                                    }}
                                >
                                    <div className="flex flex-col pt-5 cursor-default">
                                        <div className="flex items-center text-[var(--text-color)] text-[11px] uppercase font-semibold px-[12px]">
                                            <span>NGHỀ NỔI BẬT</span>
                                            <div className="flex-[1_1_auto] opacity-[90] ml-[2px]">
                                                <hr style={{ width: '98%', marginLeft: 'auto' }} />
                                            </div>
                                        </div>
                                        <ul className="mt-2 cursor-pointer w-full text-[12px] font-[500] whitespace-nowrap overflow-hidden">
                                            {listOfPopularJob.map((job) => (
                                                <li className="flex py-[8px] px-[12px] block w-full hover:bg-[#ccc]/20">
                                                    <label className="flex items-center cursor-pointer w-full">
                                                        <input
                                                            type="checkbox"
                                                            className="w-6 h-6 rounded-[2px] accent-black cursor-pointer"
                                                            checked={selectedJob.includes(job)}
                                                            onChange={() => handleJobSelection(job)}
                                                        />
                                                        <span className="ml-3 select-none">{job}</span>
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex flex-col pt-5 cursor-default">
                                        <div className="flex items-center text-[var(--text-color)] text-[11px] uppercase font-semibold px-[12px]">
                                            <span>CÁC NGHỀ KHÁC</span>
                                            <div className="flex-[1_1_auto] opacity-[90] ml-[2px]">
                                                <hr style={{ width: '98%', marginLeft: 'auto' }} />
                                            </div>
                                        </div>

                                        <ul className="mt-2 cursor-pointer w-full text-[12px] font-[500] whitespace-nowrap overflow-hidden">
                                            {listOfOtherJob.map((job) => (
                                                <li className="flex py-[8px] px-[12px] block w-full hover:bg-[#ccc]/20">
                                                    <label className="flex items-center cursor-pointer w-full">
                                                        <input
                                                            type="checkbox"
                                                            className="w-6 h-6 rounded-[2px] accent-black cursor-pointer"
                                                            checked={selectedJob.includes(job)}
                                                            onChange={() => handleJobSelection(job)}
                                                        />
                                                        <span className="ml-3 select-none">{job}</span>
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={style.divider}></div>

                        {/* Location*/}

                        <div
                            className="w-[30%] flex items-center cursor-pointer rounded-[20px] relative px-[8px]"
                            ref={locationRef}
                        >
                            <div
                                className=" flex items-center gap-[10px] hover:bg-[#f2f4f5] px-[10px] flex-[1] rounded-[20px] h-full"
                                onClick={() => setLocationOpen(!openLocation)}
                            >
                                <FontAwesomeIcon icon={faLocationDot} className="w-5 h-5" />
                                <span className="text-[12px]">
                                    {selectedProvince === '000'
                                        ? 'Toàn Quốc'
                                        : !districtCategory
                                        ? 'Tỉnh Thành'
                                        : selectedDistrict
                                        ? `${provinces.find((p) => p.code === selectedProvince)?.name}, ${
                                              provinces
                                                  .find((p) => p.code === selectedProvince)
                                                  ?.districts.find((d) => d.code === selectedDistrict)?.name
                                          }`
                                        : provinces.find((p) => p.code === selectedProvince)?.name}
                                </span>
                            </div>

                            {/* categories  */}
                            {openLocation && (
                                <div
                                    className="w-full absolute max-h-[300px] bg-white z-[1] pb-4 left-0 rounded-[5px] overflow-y-auto"
                                    style={{
                                        boxShadow:
                                            'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 4px 11px',
                                        top: 'calc(100% + 8px)',
                                    }}
                                >
                                    <div className="flex flex-col pt-3 cursor-default">
                                        <ul className="mt-2 cursor-pointer w-full text-[12px] font-[500] whitespace-nowrap overflow-hidden">
                                            {!districtCategory ? (
                                                <>
                                                    <li
                                                        className="flex pl-[12px] py-[8px] block w-full hover:bg-[#ccc]/20 text-[12px] text-black"
                                                        onClick={() => handleLocationClick('000')}
                                                    >
                                                        Toàn Quốc
                                                    </li>
                                                    {provinces.map((province) => (
                                                        <li
                                                            key={province.code}
                                                            className="flex pl-[12px] block w-full hover:bg-[#ccc]/20 justify-between items-center relative"
                                                            onClick={() => handleLocationClick(province.code)}
                                                        >
                                                            <p className="text-[12px] py-[8px] text-black">
                                                                {province.name}
                                                            </p>
                                                            <button className="absolute hover:bg-[#ccc] px-[8px] h-full right-0 cursor-pointer">
                                                                <FontAwesomeIcon icon={faAngleRight} />
                                                            </button>
                                                        </li>
                                                    ))}
                                                </>
                                            ) : (
                                                <>
                                                    <li
                                                        className="flex pl-[12px] py-[8px] block w-full text-[12px] text-black items-center"
                                                        onClick={() => handleLocationClick('back')}
                                                    >
                                                        <FontAwesomeIcon icon={faAngleLeft} className="mr-3" />
                                                        Quay Lại
                                                    </li>
                                                    {provinces
                                                        .find((p) => p.code === selectedProvince)
                                                        ?.districts.map((district) => (
                                                            <li
                                                                key={district.code}
                                                                className="flex pl-[12px] py-[8px] block w-full hover:bg-[#ccc]/20 text-[12px] text-black"
                                                                onClick={() => handleLocationClick(district.code)}
                                                            >
                                                                {district.name}
                                                            </li>
                                                        ))}
                                                </>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={style.divider}></div>

                        <Button type="button" variant="search" className="py-4 px-6 ml-4">
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="w-5 h-5" />
                        </Button>
                    </form>
                </div>
            </header>
        </>
    );
}
