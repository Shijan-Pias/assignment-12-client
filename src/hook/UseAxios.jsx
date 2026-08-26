import axios from 'axios';
import React from 'react';

const axiosInstance = axios.create({
    baseURL : `https://assignment-12-server-mngb.onrender.com`
   
})
const UseAxios = () => {
    return axiosInstance;
};

export default UseAxios;