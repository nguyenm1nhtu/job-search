'use client';

import { useState, useRef, useEffect } from 'react';
import api from '@/app/api/axios';
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
import { useClickOutside } from '@/app/components/closeDropdown';

export default function SearchBar({ onSearch }) {
    const [openCategory, setCategoryOpen] = useState(false);
    const [openLocation, setLocationOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState([]);
    const [districtCategory, setDistrictCategory] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [searchHistory, setSearchHistory] = useState([]);
    const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoriesJob, setCategoriesJob] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await api.get('/jobs/categories');
                const data = response.data.data;
                setCategoriesJob(data.map((item) => ({ id: item.category_id, name: item.name })));
            } catch (err) {
                setCategoriesJob([]);
            }
        };
        fetchCategory();
    }, []);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await api.get('/location/provinces');
                const data = response.data.data;
                setProvinces(data);
            } catch (err) {
                setProvinces([]);
            }
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        const fetchWards = async () => {
            if (selectedProvince && selectedProvince !== '000') {
                try {
                    const response = await api.get(`/location/wards?provinceCode=${selectedProvince}`);
                    const data = response.data.data;
                    setWards(data);
                } catch (err) {
                    setWards([]);
                }
            } else {
                setWards([]);
            }
        };
        fetchWards();
    }, [selectedProvince]);

    const categoryRef = useClickOutside(() => setCategoryOpen(false));
    const locationRef = useClickOutside(() => setLocationOpen(false));
    const searchInputRef = useClickOutside(() => setSearchDropdownOpen(false));

    const handleJobSelection = (jobName) => {
        setSelectedJob((prev) =>
            prev.includes(jobName) ? prev.filter((item) => item !== jobName) : [...prev, jobName],
        );
    };

    const handleLocationClick = (value) => {
        if (value === 'back') {
            setDistrictCategory(false);
            setSelectedProvince('');
            setSelectedWard('');
        } else if (!districtCategory) {
            if (value === '000') {
                setDistrictCategory(false);
                setLocationOpen(false);
                console.log(`Đã chọn toàn quốc: ${value}`);
            } else {
                setDistrictCategory(true);
            }
            setSelectedProvince(value);
            setSelectedWard('');
            console.log(`Đã chọn tỉnh/thành: ${value}`);
        } else {
            setSelectedWard(value);
            setLocationOpen(false);
            console.log(`Đã chọn quận/huyện: ${value}`);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim() && !searchHistory.includes(searchQuery)) {
            setSearchHistory((prev) => [searchQuery, ...prev.slice(0, 6)]);
        }
        const categoryIds = selectedJob
            .map((name) => categoriesJob.find((job) => job.name === name)?.id)
            .filter(Boolean)
            .join(',');
        onSearch({ searchQuery, category_id: categoryIds, province_code: selectedProvince, ward_code: selectedWard });
    };

    const handleHistoryClick = (query) => {
        setSearchQuery(query);
        setSearchDropdownOpen(false);
        onSearch({ searchQuery: query, category_id: '', province_code: '', ward_code: '' });
    };

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
                                            className="flex py-[10px] px-[20px] w-full hover:bg-[#ccc]/30 items-center gap-3"
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
                            className="flex items-center gap-[5px] hover:bg-[#f2f4f5] px-[10px] flex-[1] rounded-[20px] h-full"
                            onClick={() => setCategoryOpen(true)}
                        >
                            <FontAwesomeIcon icon={faListUl} className="w-5 h-5" />
                            <span className="text-[14px]">Danh Mục Nghề</span>
                            {selectedJob.length > 0 && (
                                <span
                                    className="rounded-full bg-[#ccc] flex items-center justify-center ml-[2px] text-[10px] truncate"
                                    style={{
                                        backgroundColor: 'rgb(230, 230, 230)',
                                        padding: '3px 6px 3px 6px',
                                    }}
                                >
                                    +{selectedJob.length}
                                </span>
                            )}
                        </div>

                        {/* Categories Dropdown */}
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

                                    {categoriesJob.length > 0 ? (
                                        <ul className="mt-2 cursor-pointer w-full text-[12px] font-[500] whitespace-nowrap overflow-hidden">
                                            {categoriesJob.map((job) => (
                                                <li
                                                    key={job.id}
                                                    className="flex py-[8px] px-[12px] block w-full hover:bg-[#ccc]/20"
                                                >
                                                    <label className="flex items-center cursor-pointer w-full">
                                                        <input
                                                            type="checkbox"
                                                            className="w-6 h-6 rounded-[2px] accent-black cursor-pointer"
                                                            checked={selectedJob.includes(job.name)}
                                                            onChange={() => handleJobSelection(job.name)}
                                                        />
                                                        <span className="ml-3 select-none">{job.name}</span>
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="px-[12px] py-[8px] text-[12px]">Không có danh mục nghề nào.</p>
                                    )}
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
                            className="flex items-center gap-[10px] hover:bg-[#f2f4f5] flex-[1] rounded-[20px] h-full px-[10px]"
                            onClick={() => setLocationOpen(!openLocation)}
                        >
                            <FontAwesomeIcon icon={faLocationDot} className="w-5 h-5" />
                            <span className="text-[14px]">
                                {selectedProvince === '000'
                                    ? 'Toàn Quốc'
                                    : selectedWard
                                      ? `${provinces.find((p) => p.code === selectedProvince)?.name}, ${wards.find((w) => w.code === selectedWard)?.name}`
                                      : provinces.find((p) => p.code === selectedProvince)?.name || 'Địa Điểm'}
                            </span>
                        </div>

                        {/* Location Dropdown */}
                        {openLocation && (
                            <div
                                className="w-full absolute max-h-[300px] bg-white z-[1] pb-4 left-0 rounded-[5px] overflow-y-auto"
                                style={{
                                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 4px 11px',
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
                                                {wards.map((ward) => (
                                                    <li
                                                        key={ward.code}
                                                        className="flex pl-[12px] py-[8px] block w-full hover:bg-[#ccc]/20 text-[12px] text-black"
                                                        onClick={() => handleLocationClick(ward.code)}
                                                    >
                                                        {ward.name}
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

                    <Button type="submit" variant="search" className="py-4 px-6 ml-4 flex items-center gap-3">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="w-5 h-5" />
                    </Button>
                </form>
            </div>
        </>
    );
}
