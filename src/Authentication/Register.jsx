import { useForm } from "react-hook-form";
import UseAuth from "../hook/UseAuth";
import SocialLogin from "./socialLogin";
import axios from "axios";
import { useState } from "react";
import UseAxios from "../hook/UseAxios";


const Register = () => {

    const { registerUser, updateProfileInfo } = UseAuth();
    const axiosInstance = UseAxios();
    const [profilePic, setProfilePic] = useState(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // Submit handler
    const onSubmit = (data) => {
        console.log("Form Data:", data);

        // 🚀 You can send this data to backend (Node/Express + MongoDB)

        registerUser(data.email, data.password)
            .then(async(result) => {
                console.log("User Registered:", result.user);

                // save the MDB 

                const userData = {

                    email: data.email,
                    role: data.role, //default
                    created_at: new Date().toISOString(),
                    last_log_in: new Date().toISOString()
                }

                const userRes = await axiosInstance.post('/users',userData);
                console.log(userRes.data);

                //update profile information in firebase
                const updateInfo = {
                    displayName: data.username,
                    photoURL: profilePic
                }

                updateProfileInfo(updateInfo)
                    .then(() => {
                        console.log('updated successfully');
                    })
                    .catch(error => {
                        console.log(error);
                    })

            })
            .catch((error) => {
                console.error(error.message);
            });
    };

    const handleImageFile = async (e) => {
        e.preventDefault();

        const image = e.target.files[0];
        console.log(image);

        const formData = new FormData();
        formData.append('image', image)

        const imageUrl = `https://api.imgbb.com/1/upload?expiration=600&key=${import.meta.env.VITE_image_key}`
        const res = await axios.post(imageUrl, formData)
        console.log(res);
        setProfilePic(res.data.data.url);




    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-black mb-6 text-center">Create an Account</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Username */}
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        {...register("username", { required: "Username is required" })}
                        className="input input-bordered w-full"
                    />
                    {errors.username && (
                        <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
                        })}
                        className="input input-bordered w-full"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>

                {/* Photo Upload */}
                <div>
                    <input type="file" onChange={handleImageFile} className="input" placeholder="Enter your Picture " />
                </div>

                {/* Password */}
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password", {
                            required: true,
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters",
                            },
                        })}
                        className="input input-bordered w-full"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                    )}
                </div>

                {/* Role Select */}
                <div>
                    <select
                        {...register("role", { required: "Role is required" })}
                        className="select select-bordered w-full"
                    >
                        <option value="">Select Role</option>
                        <option value="user">User</option>
                        <option value="seller">Seller</option>
                    </select>
                    {errors.role && (
                        <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary w-full">
                    Sign Up
                </button>
            </form>

            {/* Already have an account */}
            <p className="text-sm mt-4 text-center text-black">
                Already have an account?{" "}
                <a href="/login" className="link link-primary">
                    Login
                </a>
            </p>
            <SocialLogin></SocialLogin>
        </div>
    );
};

export default Register;
