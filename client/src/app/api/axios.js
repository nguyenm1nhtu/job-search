import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 10000, // Thời gian timeout (10s)
    headers: {
        'Content-Type': 'application/json',
    },
});

//Gan access token truoc khi request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

//
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');

                const response = await api.post('/api/auth/refresh-token', { refreshToken });

                const { token } = response.data.data;
                localStorage.setItem('accessToken', token);
                sessionStorage.setItem('accessToken', token);
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            } catch (err) {
                // Xóa token và redirect về login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('tokenExpiry');
                localStorage.removeItem('user');
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    },
);

export default api;
