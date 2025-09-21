'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import style from './Header.module.css';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { useMouseLeaveDropdown, useClickOutside } from '@/app/components/closeDropdown';
import NotificationHeader from '@/app/Layout/Notification/notificationHeader';
import api from '@/app/api/axios';

export default function Header({ login, setLogin }) {
    const [cvDropdown, setCvDropdown] = useState(false);
    const [toolsDropdown, setToolsDropdown] = useState(false);
    const [userDropdown, setUserDropdown] = useState(false);
    const [user, setUser] = useState({});
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const response = await api.get('/user/me');
            setUser(response.data.data);
        };
        fetchUser();
    }, []);

    const createCVRef = useMouseLeaveDropdown(() => {
        setCvDropdown(false);
    });

    const createToolsRef = useMouseLeaveDropdown(() => {
        setToolsDropdown(false);
    });

    const creatUserRef = useClickOutside(() => {
        setUserDropdown(false);
    });

    const handleLogoutClick = async (e) => {
        e.stopPropagation();
        try {
            await api.post('/api/auth/logout');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('tokenExpiry');
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');
            setLogin(false);
            setUser({});
            router.push('/login');
        } catch (err) {
            console.error('Lỗi khi đăng xuất:', err);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('tokenExpiry');
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');
            setLogin(false);
            setUser({});
            router.push('/login');
        }
    };

    const handleProfile = () => {
        router.push(`/profile/${user.user_id}`);
        setUserDropdown(false);
    };

    return (
        <>
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

                            <div className={style.divider_search} style={{ borderColor: 'gray' }}></div>

                            <div
                                className={clsx(style.items, 'px-[20px] py-[10px]')}
                                ref={createCVRef}
                                onMouseEnter={() => setCvDropdown(true)}
                            >
                                Tạo CV
                                <FontAwesomeIcon icon={faCaretDown} className="ml-3 w-6 h-6" />
                                {cvDropdown && (
                                    <div className={clsx(style.dropDownContainer, style.dropDownLeft)}>
                                        <div className={style.caret} />
                                        <ul className="font-[500]">
                                            <li className={style.dropdownItem}>
                                                <Link href="/manage-cvs" className="flex items-center w-full">
                                                    <Image
                                                        src="/img/header/cv-manage.png"
                                                        width={24}
                                                        height={24}
                                                        priority
                                                        className="object-contain mr-4"
                                                        alt="Quản lý CV"
                                                    />
                                                    <span>Quản lý CV</span>
                                                </Link>
                                            </li>
                                            <li className={style.dropdownItem}>
                                                <Link href="/upload-cv" className="flex items-center w-full">
                                                    <Image
                                                        src="/img/header/cv-upload.png"
                                                        width={24}
                                                        height={24}
                                                        priority
                                                        className="object-contain mr-4"
                                                        alt="Tải CV lên"
                                                    />
                                                    <span>Tải CV lên</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>

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
                                        <ul className="font-[500]">
                                            <li className={style.dropdownItem}>
                                                <Link href="#quan-ly-cv" className="flex items-center w-full">
                                                    <Image
                                                        src="/img/header/mbti.png"
                                                        width={24}
                                                        height={24}
                                                        priority
                                                        className="object-contain mr-4"
                                                        alt="Trắc nghiệm tính cách"
                                                    />
                                                    <span>Trắc nghiệm tính cách</span>
                                                </Link>
                                            </li>
                                            <li className={style.dropdownItem}>
                                                <Link href="#tai-cv-len" className="flex items-center w-full">
                                                    <Image
                                                        src="/img/header/gross-net.png"
                                                        width={24}
                                                        height={24}
                                                        priority
                                                        className="object-contain mr-4"
                                                        alt="Tính lương Gross-Net"
                                                    />
                                                    <span>Tính lương Gross-Net</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className={clsx(style.items, 'px-[20px] py-[10px]')}>Cẩm nang nghề nghiệp</div>
                        </div>

                        <div className="flex gap-[15px] items-center">
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
                                                    src={user.avatar_path || '/img/header/avatar/default-ava.jpg'}
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
                                                        <div className="w-full h-full" onClick={handleProfile}>
                                                            Thông tin tài khoản
                                                        </div>
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
                                    <Link href="/login" className="px-8 py-4 hover:text-[var(--primary-color)]">
                                        <p className="text-[14px] font-semibold">Đăng nhập</p>
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-8 py-4 border-1 border-[var(--primary-color)] rounded-[20px]"
                                    >
                                        <p className="text-[14px] font-semibold text-[var(--primary-color)]">Đăng ký</p>
                                    </Link>
                                </>
                            )}
                            {login && user.role === 'recruiter' && (
                                <Link
                                    href="#"
                                    className="ml-5 px-8 py-4 rounded-[10px] bg-[var(--primary-color)] hover:opacity-80"
                                >
                                    <p className="text-[14px] font-semibold text-white">Đăng tin tuyển dụng</p>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
