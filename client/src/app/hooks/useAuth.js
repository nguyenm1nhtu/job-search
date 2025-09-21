'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/api/axios';

export function useAuth() {
    const [login, setLogin] = useState(false);
    const router = useRouter();

    const checkToken = async () => {
        let accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
        const tokenExpiry = localStorage.getItem('tokenExpiry') || sessionStorage.getItem('tokenExpiry');

        if (accessToken && tokenExpiry) {
            const currentTime = Date.now();
            const expiryTime = new Date(tokenExpiry).getTime();
            const timeLeft = (expiryTime - currentTime) / 1000;

            if (timeLeft < 300 && timeLeft > 0) {
                try {
                    const response = await api.post('/api/auth/refresh-token', { refreshToken });
                    const { token: newAccessToken, expiresIn } = response.data.data;

                    const storage = localStorage.getItem('accessToken') ? localStorage : sessionStorage;
                    storage.setItem('accessToken', newAccessToken);
                    const newExpiry = new Date(Date.now() + expiresIn * 1000).toISOString();
                    storage.setItem('tokenExpiry', newExpiry);
                    setLogin(true);
                } catch (err) {
                    clearStorage();
                    setLogin(false);
                    router.push('/login');
                }
            } else if (timeLeft <= 0) {
                clearStorage();
                setLogin(false);
                router.push('/login');
            } else {
                setLogin(true);
            }
        } else {
            setLogin(false);
        }
    };

    const clearStorage = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiry');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('tokenExpiry');
    };

    //Kiem tra time va token
    useEffect(() => {
        //Lan dau render home
        checkToken();

        //Moi khi chuyen tab
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                checkToken();
            }
        };

        //Check moi 10p
        const interval = setInterval(checkToken, 10 * 60 * 1000);

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [router]);

    return { login, setLogin };
}
