
import { useNavigate } from "react-router";
import UseAuth from "../hook/UseAuth";
import UseAxios from "../hook/UseAxios";

export default function SocialLogin() {

    const { signInGoogle } = UseAuth();
    const axiosInstance = UseAxios();
    const navigate = useNavigate();

    const handleGoogleLogin = () => {
        signInGoogle()
            .then(async(result) => {
                const user = result.user
                console.log("Google user:", result.user);
                // TODO: Save user info to DB if needed
                const userData = {

                    email: user.email,
                    role: 'user', //default
                    created_at: new Date().toISOString(),
                    last_log_in: new Date().toISOString()
                }

                 const userRes = await axiosInstance.post('/users',userData);
                console.log(userRes.data);
                navigate('/')
            })
            .catch(error => {
                console.error("Google login error:", error);
            });


    }


    return (
        <div className="w-full">
            {/* OR divider */}
            <div className="flex items-center gap-3 my-4">
                <div className="flex-grow h-px bg-gray-300"></div>
                <span className="text-gray-500">OR</span>
                <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            {/* Google Button */}
            <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition"
            >
                <img
                    className="w-5 h-5"
                    src="https://www.svgrepo.com/show/355037/google.svg"
                    alt="Google logo"
                />
                Continue with Google
            </button>
        </div>
    );
}
