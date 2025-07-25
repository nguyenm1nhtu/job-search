'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale/vi';
import { useClickOutside } from '@/app/components/closeDropdown';
import Button from '@/app/components/button';
import initialNotifications from '@/app/data/notification.json';
import style from './notification.module.css';

// Ánh xạ ảnh với mỗi loại thông báo
const getImageSrc = (category) => {
    const iconMap = {
        application: '/img/header/notification/application.jpg',
        interviewed: '/img/header/notification/interviewed.jpg',
        mbti: '/img/header/notification/mbti.jpg',
    };
    return iconMap[category];
};

export default function NotificationHeader() {
    const [notificationDropdown, setNotificationDropdown] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [activeOptionId, setActiveOptionId] = useState(null);

    useEffect(() => {
        console.log('Fetching notifications from JSON');
        const sortedNotifications = [...initialNotifications].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setNotifications(sortedNotifications);
        setNotificationCount(sortedNotifications.filter((n) => !n.isRead).length);
    }, []);

    const recentNotifications = notifications.slice(0, 6);

    const notificationRef = useClickOutside(() => {
        setNotificationDropdown(false);
        setActiveOptionId(null);
    });

    // Xóa thông báo
    const handleDeleteNotification = (id) => {
        console.log('Deleting notification:', id);
        const deletedNotification = notifications.find((n) => n.id === id);
        setNotifications(notifications.filter((n) => n.id !== id));

        if (deletedNotification && !deletedNotification.isRead) {
            setNotificationCount((prev) => Math.max(0, prev - 1));
        }
    };

    // Đánh dấu đã đọc
    const handleNotificationClick = (id) => {
        console.log('Marking notification as read:', id);
        const updatedNotifications = notifications.map((notification) => {
            if (notification.id === id && !notification.isRead) {
                return { ...notification, isRead: true };
            }
            return notification;
        });
        setNotifications(updatedNotifications);

        const clickedNotification = notifications.find((notification) => notification.id === id);
        if (clickedNotification && !clickedNotification.isRead) {
            setNotificationCount((prev) => {
                if (prev > 0) {
                    return prev - 1;
                }
                return 0;
            });
        }
    };

    // Đánh dấu tất cả là đã đọc
    const markAllAsRead = () => {
        console.log('Marking all notifications as read');
        const updatedNotifications = notifications.map((notification) => ({
            ...notification,
            isRead: true,
        }));
        setNotifications(updatedNotifications);
        setNotificationCount(0);
    };

    return (
        <div
            className={style.items}
            ref={notificationRef}
            onClick={() => setNotificationDropdown(!notificationDropdown)}
        >
            <div className={style.notifyContainer}>
                <svg viewBox="3 2.5 14 14" x="0" y="0" className="w-7 h-7">
                    <path d="m17 15.6-.6-1.2-.6-1.2v-7.3c0-.2 0-.4-.1-.6-.3-1.2-1.4-2.2-2.7-2.2h-1c-.3-.7-1.1-1.2-2.1-1.2s-1.8.5-2.1 1.3h-.8c-1.5 0-2.8 1.2-2.8 2.7v7.2l-1.2 2.5-.2.4h14.4zm-12.2-.8.1-.2.5-1v-.1-7.6c0-.8.7-1.5 1.5-1.5h6.1c.8 0 1.5.7 1.5 1.5v7.5.1l.6 1.2h-10.3z"></path>
                    <path d="m10 18c1 0 1.9-.6 2.3-1.4h-4.6c.4.9 1.3 1.4 2.3 1.4z"></path>
                </svg>
            </div>

            {/* Số thông báo */}
            {notificationCount >= 1 && (
                <div className={style.notifyCount}>
                    <p className="text-white text-[9px] font-semibold flex justify-center items-center select-none">
                        {Math.min(notificationCount, 99)}
                    </p>
                </div>
            )}

            {notificationDropdown && (
                <div
                    className={`absolute bg-white rounded-[10px] shadow-lg w-[360px] py-5 cursor-default z-20`}
                    style={{
                        top: 'calc(100%)',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 4px 11px',
                    }}
                >
                    <div className={style.caret} style={{ left: '50%' }} />

                    <div
                        className="flex justify-between items-center w-full block px-7 py-5"
                        style={{ borderBottom: '1px solid #f4f5f5' }}
                    >
                        <span className="text-[18px] text-black font-semibold">Thông báo</span>

                        <button
                            className="font-[400] text-[var(--primary-color)] text-[12px] cursor-pointer"
                            onClick={markAllAsRead}
                        >
                            Đánh dấu tất cả là đã đọc
                        </button>
                    </div>

                    {notifications.length > 0 ? (
                        <>
                            <ul className="font-[500]">
                                {recentNotifications.map((notification) => (
                                    <li key={notification.id} className={style.dropdownItem}>
                                        <Link
                                            href={notification.href}
                                            className="flex items-center justify-between w-full"
                                            onClick={() => handleNotificationClick(notification.id)}
                                        >
                                            <div className="flex items-center justify-between gap-[10px]">
                                                <Image
                                                    src={getImageSrc(notification.category)}
                                                    width={25}
                                                    height={25}
                                                    priority
                                                    className="object-contain mr-4"
                                                    alt={notification.title}
                                                />
                                                <div className="flex flex-col justify-center gap-[2px]">
                                                    <span className={style.notificationText}>{notification.title}</span>
                                                    <span className="text-[10px] text-[var(--text-color)]">
                                                        {formatDistanceToNow(new Date(notification.createdAt), {
                                                            addSuffix: true,
                                                            locale: vi,
                                                        })}
                                                    </span>
                                                </div>
                                            </div>

                                            {!notification.isRead && <div className={style.isRead}></div>}
                                        </Link>

                                        {/* Tùy chọn thông báo */}

                                        <button
                                            className={style.optionButton}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveOptionId(
                                                    activeOptionId === notification.id ? null : notification.id,
                                                );
                                            }}
                                        >
                                            <img
                                                src="/img/header/notification/3-dots-row.png"
                                                alt="option"
                                                className="w-8 h-8"
                                            />
                                        </button>

                                        {activeOptionId === notification.id && (
                                            <div
                                                className="absolute bg-white rounded-[8px] shadow-lg w-[200px] py-2 z-30"
                                                style={{ top: '70%', right: '10%' }}
                                                onClick={(e) => {
                                                    setActiveOptionId(null);
                                                }}
                                            >
                                                <button
                                                    className="block w-full text-left px-5 py-4 text-[14px] text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleNotificationClick(notification.id);
                                                        setActiveOptionId(null);
                                                    }}
                                                >
                                                    Đánh dấu đã đọc
                                                </button>
                                                <button
                                                    className="block w-full text-left px-5 py-4 text-[14px] text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteNotification(notification.id);
                                                        setActiveOptionId(null);
                                                    }}
                                                >
                                                    Xóa thông báo này
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>

                            <div className="px-5 mt-5">
                                <Button variant="auth" className={style.notifyAllBtn}>
                                    Xem tất cả tin nhắn
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="w-full flex flex-col items-center justify-center gap-[15px] pt-2">
                            <Image
                                src="/img/header/toppy-notification-empty.png"
                                width={139}
                                height={140}
                                priority
                                className="object-contain mr-4 flex-1"
                                alt="No notifications"
                            />
                            <p className="text-[14px] text-[var(--text-color)] font-[400]">
                                Hiện chưa có thông báo nào!
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
