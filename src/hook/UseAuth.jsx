import React, { use } from 'react';
import { AuthContext } from '../context/AuthContext';

const UseAuth = () => {
   const useAuth = use(AuthContext)
   return useAuth;
};

export default UseAuth;