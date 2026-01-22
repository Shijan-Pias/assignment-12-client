import axios from 'axios';
import { useEffect } from 'react';
import UseAuth from './UseAuth';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({
    baseURL: `https://ph-assignment-12-server-eight.vercel.app`,
    
});

const UseAxiosSecure = () => {
    const { user, logoutUser } = UseAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // ১. রিকোয়েস্ট ইন্টারসেপ্টর (টোকেন পাঠানোর জন্য)
        const requestInterceptor = axiosSecure.interceptors.request.use(async (config) => {
            
            // ইউজার যদি লগইন করা থাকে, তবেই টোকেন নিব
            if (user) {
                // Firebase এর নিজস্ব মেথড দিয়ে টোকেন বের করা (LocalStorage লাগবে না)
                const token = await user.getIdToken(); 
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });

        // ২. রেসপন্স ইন্টারসেপ্টর (এরর হ্যান্ডলিং এর জন্য)
        const responseInterceptor = axiosSecure.interceptors.response.use((response) => {
            return response;
        }, async (error) => {
            // আগের কোডে error.status কাজ করছিল না, সঠিক হলো error.response.status
            const status = error.response ? error.response.status : null;
            
            // টোকেন এক্সপায়ার হলে বা ভুল হলে লগআউট করে দিবে
            if (status === 401 || status === 403) {
                await logoutUser();
                navigate('/login');
            }
            return Promise.reject(error);
        });

        // ক্লিনআপ (যাতে মেমোরি লিক না হয়)
        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        }

    }, [user, logoutUser, navigate]); // user চেঞ্জ হলে ইন্টারসেপ্টর আবার রান করবে

    return axiosSecure;
};

export default UseAxiosSecure;