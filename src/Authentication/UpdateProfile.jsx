import React, { useEffect, useState } from "react";
import { getAuth, updateProfile } from "firebase/auth"; // Firebase function
import Swal from "sweetalert2";
import UseAuth from "../hook/UseAuth";
import UseAxiosSecure from "../hook/UseAxiosSecure"; // Secure hook use koro
import { auth } from '../Firebase/firebase.init'

const UpdateProfile = () => {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();
    console.log(user);
    // State initialization
    const [name, setName] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    const [loading, setLoading] = useState(false);

    // 1. Load user data when component mounts
    useEffect(() => {
        if (user) {
            setName(user.displayName || "");
            setPhotoURL(user.photoURL || "");
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 2. Update Firebase Profile (Frontend Update)
            await updateProfile(auth.currentUser, {
                displayName: name,
                photoURL: photoURL
            });

            // 3. Update Database (Backend Update)
            const res = await axiosSecure.put(`/users/email/${user.email}`, {
                name: name,
                profilePic: photoURL,
            });

            if (res.data.modifiedCount > 0 || res.data.acknowledged) {
                Swal.fire({
                    title: "Updated!",
                    text: "Profile updated successfully.",
                    icon: "success",
                    confirmButtonColor: "#10B981"
                }).then(() => {
                    window.location.reload(); // Refresh to see changes everywhere
                });
            }
        } catch (error) {
            console.error("Update failed:", error);
            Swal.fire({
                title: "Error",
                text: "Something went wrong!",
                icon: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-50 pt-20">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">Update Profile</h2>

                {/* Profile Preview */}
                <div className="flex justify-center mb-6">
                    <div className="avatar">
                        <div className="w-24 rounded-full ring ring-emerald-500 ring-offset-base-100 ring-offset-2">
                            <img src={photoURL || user?.photoURL} alt="Profile" />
                        </div>
                    </div>
                </div>

                <form onSubmit={handleUpdate} className="space-y-4">
                    {/* Name Input */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold text-slate-600">Full Name</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Type your name"
                            className="input input-bordered w-full focus:border-emerald-500 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Photo URL Input */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold text-slate-600">Photo URL</span>
                        </label>
                        <input
                            type="text"
                            value={photoURL}
                            onChange={(e) => setPhotoURL(e.target.value)}
                            placeholder="https://example.com/photo.jpg"
                            className="input input-bordered w-full focus:border-emerald-500 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="form-control mt-6">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="btn bg-emerald-500 hover:bg-emerald-600 text-white w-full text-lg shadow-lg shadow-emerald-200"
                        >
                            {loading ? <span className="loading loading-spinner"></span> : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;