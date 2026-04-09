import axios from 'axios';
import React from 'react';

const axiosInstance = axios.create({
    baseURL : `https://pharmacy-backend-aqm0.onrender.com`
   
})
const UseAxios = () => {
    return axiosInstance;
};

export default UseAxios;