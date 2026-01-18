import axios from 'axios';
import React from 'react';

const axiosInstance = axios.create({
    // baseURL : `https://ph-assignment-12-server-eight.vercel.app`
    baseURL: `http://localhost:5000`
})
const UseAxios = () => {
    return axiosInstance;
};

export default UseAxios;