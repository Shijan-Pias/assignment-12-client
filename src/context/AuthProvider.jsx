import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import {

    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
} from "firebase/auth";
import { auth } from '../Firebase/firebase.init';

 const googleProvider = new GoogleAuthProvider();


const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    // Register
    const registerUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Login
    const loginUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Logout
    const logoutUser = () => {
        setLoading(true);
        return signOut(auth);
    };

    //update

    const updateProfileInfo = userInfo =>{
        return updateProfile(auth.currentUser , userInfo)
    }

    // Track User
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    //google
    const signInGoogle =()=>{
        setLoading(true)
        return signInWithPopup(auth,googleProvider)
    }




    const authInfo = {
        registerUser,
        loginUser,
        logoutUser,
        user,
        loading,
        signInGoogle,
        updateProfileInfo


    }
    return (
        <AuthContext value={authInfo}>

           {children}

        </AuthContext>
    );
};

export default AuthProvider;