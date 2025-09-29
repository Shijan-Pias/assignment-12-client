import { useForm } from "react-hook-form";
import SocialLogin from "./socialLogin";
import UseAuth from "../hook/UseAuth";
import {  useNavigate } from "react-router";

const Login = () => {
  const { loginUser } = UseAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Submit handler
  const onSubmit = (data) => {
    console.log("Login Data:", data);

    // 🚀 You can send this to backend (Node/Express + MongoDB) or Firebase
    loginUser(data.email, data.password)
      .then(result => {
        console.log(result.user);
        navigate('/')
      })
      .catch((error) => {
        console.error("Login Failed:", error.message);
      });
  };

  return (
    <div>
      <h2 className="text-2xl text-black font-bold mb-6 text-center">Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        {/* Password */}
        <div>
          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
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

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-full">
          Login
        </button>
      </form>

      {/* Register Link */}
      <p className="text-sm mt-4 text-black text-center">
        Don’t have an account?{" "}
        <a  href="/register" className="link link-primary">
          Sign Up
        </a>
      </p>
      <SocialLogin></SocialLogin>
    </div>
  );
};

export default Login;
