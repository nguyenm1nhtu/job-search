'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import style from './searchBar.module.css';
import Button from '@/app/components/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faListUl,
    faLocationDot,
    faMagnifyingGlass,
    faAngleRight,
    faAngleLeft,
    faClockRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import provinces from '@/app/data/provinces.json';
import { useClickOutside } from '@/app/components/closeDropdown';

export default function SearchBar() {
    const [openCategory, setCategoryOpen] = useState(false);
    const [openLocation, setLocationOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState([]);
    const [districtCategory, setDistrictCategory] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [searchHistory, setSearchHistory] = useState([]);
    const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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

    const categoryRef = useClickOutside(() => setCategoryOpen(false));
    const locationRef = useClickOutside(() => setLocationOpen(false));
    const searchInputRef = useClickOutside(() => setSearchDropdownOpen(false));

    const handleJobSelection = (job) => {
        setSelectedJob((prev) => (prev.includes(job) ? prev.filter((item) => item != job) : [...prev, job]));
    };

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

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim() && !searchHistory.includes(searchQuery)) {
            setSearchHistory((prev) => [searchQuery, ...prev.slice(0, 6)]);
        }
        console.log('Tìm kiếm:', { searchQuery, selectedJob, selectedProvince, selectedDistrict });
    };

    const handleHistoryClick = (query) => {
        setSearchQuery(query);
        console.log('Tìm kiếm từ lịch sử:', query);
        setSearchDropdownOpen(false);
    };

    useEffect(() => {
        console.log('Danh sách nghề đã chọn:', selectedJob);
    }, [selectedJob]);

    return (
        <>
            {/* Search bar */}

            <div className={style.searchBarContainer}>
                <form className={style.searchBarForm} onSubmit={handleSearch}>
                    {/* Search input */}

                    <div className="flex-1 relative pl-[14px]" ref={searchInputRef}>
                        <input
                            type="text"
                            className="text-[14px] border-none outline-none w-full h-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClick={() => setSearchDropdownOpen(true)}
                            style={{ padding: '0 8px 0 8px' }}
                            placeholder="Công việc hoặc tên công ty cần tìm..."
                        />

                        {/* Search History */}

                        {searchDropdownOpen && searchHistory.length > 0 && (
                            <div
                                className="w-full absolute max-h-[500px] bg-white z-[1] py-4 left-0 rounded-[10px] overflow-y-auto"
                                style={{
                                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 4px 11px',
                                    top: 'calc(100% + 12px)',
                                }}
                            >
                                <div className="px-[20px] py-[10px] text-[16px] font-bold text-[var(--primary-color)]">
                                    LỊCH SỬ TÌM KIẾM
                                </div>
                                <ul className="cursor-pointer w-full text-[14px] whitespace-nowrap overflow-hidden font-semibold">
                                    {searchHistory.map((query, index) => (
                                        <li
                                            key={index}
                                            className="flex py-[10px] px-[20px] w-full hover:bg-[#ccc]/30 items-center gap-3 "
                                            onClick={() => handleHistoryClick(query)}
                                        >
                                            <FontAwesomeIcon
                                                icon={faClockRotateLeft}
                                                className="w-6 h-6 text-gray-500"
                                            />
                                            {query}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className={style.divider}></div>

                    {/* Categories */}

                    <div
                        className="w-[20%] flex items-center cursor-pointer rounded-[20px] relative mx-[8px]"
                        ref={categoryRef}
                    >
                        <div
                            className=" flex items-center gap-[5px] hover:bg-[#f2f4f5] px-[10px] flex-[1] rounded-[20px] h-full"
                            onClick={() => setCategoryOpen(true)}
                        >
                            <FontAwesomeIcon icon={faListUl} className="w-5 h-5" />
                            <span className="text-[14px]">Danh Mục Nghề</span>
                            {selectedJob.length > 0 ? (
                                <span
                                    className="rounded-full bg-[#ccc] flex items-center justify-center ml-[2px] text-[10px] truncate"
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

                        {/* Categories Dropdown*/}

                        {openCategory && (
                            <div
                                className="w-full absolute max-h-[400px] bg-white z-[1] pb-5 left-0 rounded-[5px] overflow-y-auto"
                                style={{
                                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 4px 11px',
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

                    {/* Location */}

                    <div
                        className="w-[20%] flex items-center cursor-pointer rounded-[20px] relative mx-[8px]"
                        ref={locationRef}
                    >
                        <div
                            className=" flex items-center gap-[10px] hover:bg-[#f2f4f5] flex-[1] rounded-[20px] h-full px-[10px]"
                            onClick={() => setLocationOpen(!openLocation)}
                        >
                            <FontAwesomeIcon icon={faLocationDot} className="w-5 h-5" />
                            <span className="text-[14px]">
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

                            {/* Location categories*/}
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
                                                        className="flex pl-[12px] py-[8px] block w-full hover:bg-[#ccc]/20 text-[12px]"
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
                    </div>

                    <div className={style.divider}></div>

                    <Button type="submit" variant="search" className="py-4 px-6 ml-4 flex items-center gap-3">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="w-5 h-5" />
                    </Button>
                </form>
            </div>
        </>
    );
}
