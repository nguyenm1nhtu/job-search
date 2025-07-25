'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Loading from '@/app/components/loading/loading';
import style from './Header.module.css';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { useMouseLeaveDropdown, useClickOutside } from '@/app/components/closeDropdown';
import NotificationHeader from '@/app/Layout/Notification/notificationHeader';
import dropdownData from '@/app/data/headerSection';

export default function Header() {
    const [isLoading, setIsLoading] = useState(false);
    const [cvDropdown, setCvDropdown] = useState(false);
    const [toolsDropdown, setToolsDropdown] = useState(false);
    const [userDropdown, setUserDropdown] = useState(false);
    const [login, setLogin] = useState(true);
    const router = useRouter();

    const createCVRef = useMouseLeaveDropdown(() => {
        setCvDropdown(false);
    });

    const createToolsRef = useMouseLeaveDropdown(() => {
        setToolsDropdown(false);
    });

    const creatUserRef = useClickOutside(() => {
        setUserDropdown(false);
    });

    const handleLogoutClick = (e) => {
        e.stopPropagation();
        console.log('Logout clicked');
        setLogin(false);
        router.push('/auth/login');
    };

    return (
        <>
            {isLoading && <Loading />}
            <header id="header">
                <div className={style.header}>
                    <div className="flex mx-auto px-[80px] max-w-[1440px] w-full h-full justify-between">
                        <div className="flex gap-[5px] items-center cursor-pointer">
                            <Link
                                href="/"
                                className="text-[3rem] text-black cursor-pointer font-semibold pr-[2rem] select-none mr-3"
                            >
                                <p style={{ fontFamily: 'iconFont, sans-serif' }}>BotCV</p>
                            </Link>

                            <div
                                className={style.divider_search}
                                style={{
                                    borderColor: 'gray',
                                }}
                            ></div>

                            <div
                                className={clsx(style.items, 'px-[20px] py-[10px]')}
                                ref={createCVRef}
                                onMouseEnter={() => {
                                    setCvDropdown(true);
                                }}
                            >
                                Tạo CV
                                <FontAwesomeIcon icon={faCaretDown} className="ml-3 w-6 h-6" />
                                {cvDropdown && (
                                    <div className={clsx(style.dropDownContainer, style.dropDownLeft)}>
                                        <div className={style.caret} />
                                        {dropdownData.dropdowns
                                            .find((dropdown) => dropdown.id === 'createCV')
                                            .items.map((section, index) => (
                                                <ul key={index} className={`font-[500]`}>
                                                    {section.section && (
                                                        <li className="px-7 py-3 text-[var(--primary-color)] text-[14px] font-semibold">
                                                            <span>{section.section}</span>
                                                        </li>
                                                    )}
                                                    {section.items.map((item) => (
                                                        <li key={item.id} className={style.dropdownItem}>
                                                            <Link href={item.href} className="flex items-center w-full">
                                                                <Image
                                                                    src={item.icon}
                                                                    width={24}
                                                                    height={24}
                                                                    priority
                                                                    className="object-contain mr-4"
                                                                    alt={item.title}
                                                                />
                                                                <span>{item.title}</span>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ))}
                                    </div>
                                )}
                            </div>

                            {/* Dropdown Công cụ */}
                            <div
                                className={clsx(style.items, 'px-[20px] py-[10px]')}
                                ref={createToolsRef}
                                onMouseEnter={() => setToolsDropdown(true)}
                            >
                                Công cụ
                                <FontAwesomeIcon icon={faCaretDown} className="ml-3 w-6 h-6" />
                                {toolsDropdown && (
                                    <div className={clsx(style.dropDownContainer, style.dropDownLeft)}>
                                        <div className={style.caret} />
                                        {dropdownData.dropdowns
                                            .find((dropdown) => dropdown.id === 'tools')
                                            .items.map((section, index) => (
                                                <ul key={index} className="font-[500]">
                                                    {section.items.map((item) => (
                                                        <li key={item.id} className={style.dropdownItem}>
                                                            <Link href={item.href} className="flex items-center w-full">
                                                                <Image
                                                                    src={item.icon}
                                                                    width={24}
                                                                    height={24}
                                                                    priority
                                                                    className="object-contain mr-4"
                                                                    alt={item.title}
                                                                />
                                                                <span>{item.title}</span>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ))}
                                    </div>
                                )}
                            </div>

                            {/* Cẩm nang nghề nghiệp */}
                            <div className={clsx(style.items, 'px-[20px] py-[10px]')}>Cẩm nang nghề nghiệp</div>
                        </div>

                        <div className="flex gap-[15px] items-center">
                            {/* Đăng nhập, đăng ký */}
                            {login ? (
                                <>
                                    <NotificationHeader />

                                    <div
                                        className={style.items}
                                        ref={creatUserRef}
                                        onClick={() => setUserDropdown(true)}
                                    >
                                        <div className="w-[40px] h-[40px] relative">
                                            <div className={style.userAvatar}>
                                                <img
                                                    src="/img/header/avatar/default-ava.jpg"
                                                    alt="user-avatar"
                                                    className="w-full h-full"
                                                />
                                                <div className={style.userArrow}>
                                                    <FontAwesomeIcon icon={faAngleDown} />
                                                </div>
                                            </div>
                                        </div>
                                        {userDropdown && (
                                            <div className={clsx(style.dropDownContainer, style.dropDownCenter)}>
                                                <div className={clsx(style.caret, style.caretCenter)} />
                                                <ul className="font-[500]">
                                                    <li className={style.dropdownItem}>
                                                        <div className="w-full h-full">Thông tin tài khoản</div>
                                                    </li>
                                                    <li className={style.dropdownItem}>
                                                        <div className="w-full h-full" onClick={handleLogoutClick}>
                                                            Đăng xuất
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link href="./auth/login" className="px-8 py-4 hover:text-[var(--primary-color)]">
                                        <p className="text-[14px] font-semibold">Đăng nhập</p>
                                    </Link>

                                    <Link
                                        href="./auth/register"
                                        className="px-8 py-4 border-1 border-[var(--primary-color)] rounded-[20px]"
                                    >
                                        <p className="text-[14px] font-semibold text-[var(--primary-color)]">Đăng ký</p>
                                    </Link>
                                </>
                            )}

                            <Link
                                href="#"
                                className="ml-5 px-8 py-4 rounded-[10px] bg-[var(--primary-color)] hover:opacity-80"
                            >
                                <p className="text-[14px] font-semibold text-white">Đăng tin tuyển dụng</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
