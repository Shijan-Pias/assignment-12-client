import { Link, Outlet } from "react-router";
import image from '../assets/295128.png'


const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Info / Branding */}
      <div className="  md:w-1/2  text-white items-center justify-center p-10">
        <div className="text-center space-y-6">
          <img
            src={image}
            alt="Healthcare illustration"
            className="w-72 mx-auto"
          />
        </div>
        <div className="mt-6 text-center text-sm text-emerald-500">
            <p>
              Back to{" "}
              <Link to="/" className="link link-primary">
                Home
              </Link>
            </p>
          </div>
      </div>

      
      <div className="flex-1 flex items-center justify-center p-6 bg-base-100">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
         
          <Outlet />

          
          
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
