
import UseUserRole from "../hook/UseUserRole";
import UseAuth from "../hook/UseAuth";

import { Navigate } from "react-router";


const AdminRoute = ({children}) => {
  const { role, roleLoading } = UseUserRole();
   const {user,loading} = UseAuth();

    if(loading){
        return <span className="loading loading-dots loading-lg"></span>
    }

  if (roleLoading) {
    // Show loading while checking role
    return <div>Loading...</div>;
  }

  if (!user || role !== "admin") {
    // Redirect non-admin users
    return <Navigate to='/forbiden'></Navigate>
  }

  // If admin, render nested routes
  return children;
};

export default AdminRoute;
