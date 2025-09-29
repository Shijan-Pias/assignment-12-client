import React from 'react';
import UseAuth from '../hook/UseAuth';
import { Navigate } from 'react-router';

const PrivateRoutes = ({children}) => {

    const {user,loading} = UseAuth();

    if(loading){
        return <span className="loading loading-dots loading-lg"></span>
    }

    if(!user){
        <Navigate to='/login'></Navigate>
    }
    return children;
};

export default PrivateRoutes;