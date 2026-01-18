import axios from 'axios';
import React from 'react';
import UseAuth from './UseAuth';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({
    // baseURL : `https://ph-assignment-12-server-eight.vercel.app`
    baseURL: `http://localhost:5000`
})
const UseAxiosSecure = () => {
  const {user , logoutUser} =UseAuth();
  const navigate = useNavigate();

  axiosSecure.interceptors.request.use(config =>{
    config.headers.Authorization = `Bearer ${user.accessToken}`
    return config;

  }, error =>{
    return Promise.reject(error)
  })

  axiosSecure.interceptors.response.use(res =>{
    
    return res;

  }, error =>{
    console.log('error handlling', error.status);
    const status = error.status;
    if(status === 403){
      navigate('/forbiden')

    }
    else if (status === 401){
      logoutUser()
      .then(()=>{
        navigate('/login')
      })
      .catch(()=>{ })

    }
    return Promise.reject(error)
  })


  return axiosSecure;
};

export default UseAxiosSecure;