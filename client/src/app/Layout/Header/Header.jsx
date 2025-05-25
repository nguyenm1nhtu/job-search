'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Loading from '@/app/components/loading/loading';
import style from './Header.module.css';
import Input from '@/app/components/input';
import clsx from 'clsx';
import Button from '@/app/components/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl, faLocationDot, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
    const [isLoading, setIsLoading] = useState(false);
    const [openCategory, isCategoryOpen] = useState(false);

    let listOfPopularJob = ['Marketing', 'Accountant', 'IT Hardware', 'IT Software', 'Teacher', 'Lawyer', 'Healthcare'];
    let listOfOtherJob = ['Media', 'KOL Mananger', 'Security', 'Telecommunications', 'Stock', 'Secretary'];

    // useEffect(() => {
    //     function handleClickOutside(event) {
    //         if ()
    //     }
    // }, [])

    return (
        <>
            {isLoading && <Loading />}
            <header className={style.header}>
                <Link href="/" className="text-[3rem] text-black cursor-pointer font-semibold pr-[2rem] select-none">
                    <p style={{ fontFamily: 'iconFont, sans-serif' }}>BotCV</p>
                </Link>

                <div className="w-[840px] h-[50px] rounded-[15px] border-2 border-[#e8e8e8]">
                    <form className="flex w-full h-full py-[6px] px-[10px] select-none">
                        <input
                            type="text"
                            className="flex-1 text-[14px] border-none outline-none"
                            style={{ padding: '0 8px 0 8px' }}
                            placeholder="Job position or company name..."
                        />

                        <div className={style.divider}></div>

                        <div className="w-[25%] flex items-center cursor-pointer rounded-[20px] relative px-[8px]">
                            <div className=" flex items-center gap-[10px] hover:bg-[#f2f4f5] px-[10px] flex-[1] rounded-[20px] h-full">
                                <FontAwesomeIcon icon={faListUl} className="w-5 h-5" />
                                <span className="text-[14px]">Category</span>
                            </div>
                            <div
                                className="w-full absolute max-h-[300px] bg-white z-[1] pb-5 left-0 rounded-[5px] overflow-y-auto"
                                style={{
                                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 4px 11px',
                                    top: 'calc(100% + 8px)',
                                }}
                            >
                                <div className="flex flex-col pt-5 cursor-default">
                                    <div className="flex items-center text-[var(--text-color)] text-[11px] uppercase font-semibold px-[12px]">
                                        <span>popular job</span>
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
                                                    />
                                                    <span className="ml-3 select-none">{job}</span>
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex flex-col pt-5 cursor-default">
                                    <div className="flex items-center text-[var(--text-color)] text-[11px] uppercase font-semibold px-[12px]">
                                        <span>Other job</span>
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
                                                    />
                                                    <span className="ml-3 select-none">{job}</span>
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className={style.divider}></div>

                        <div className="w-[20%] flex items-center cursor-pointer rounded-[20px] relative px-[8px]">
                            <div className=" flex items-center gap-[10px] hover:bg-[#f2f4f5] px-[10px] flex-[1] rounded-[20px] h-full">
                                <FontAwesomeIcon icon={faLocationDot} className="w-5 h-5" />
                                <span className="text-[14px]">Location</span>
                            </div>
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
