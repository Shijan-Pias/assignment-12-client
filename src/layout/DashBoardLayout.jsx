import React from 'react';
import { NavLink, Outlet } from 'react-router';
import UseUserRole from '../hook/UseUserRole';

const DashBoardLayout = () => {
    const { role, roleLoading } = UseUserRole();
    console.log(role);
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col ">

                {/* Navbar */}
                <div className="navbar bg-base-300 w-full  lg:hidden">
                    <div className="flex-none">
                        <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-6 w-6 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            </svg>
                        </label>
                    </div>
                    <div className="mx-2 flex-1 px-2 lg:hidden">DashBoard</div>

                </div>
                {/* Page content here */}
                <Outlet></Outlet>
                {/* Page content here */}

            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    {/* Sidebar content here */}
                    <li><NavLink to='/'>Home</NavLink></li>

                    {
                        role == 'user' && <>

                            <li><NavLink to='/dashBoard/paymentHistory'>My all payment</NavLink></li>
                            <li><NavLink to='/dashBoard/myPrescription'>My Prescription</NavLink></li>
                        </>
                    }

                    {/* seller routes */}
                    {

                        role == 'seller' && <>
                            <li>
                                <NavLink to='/dashBoard/addMedicine'>Add Medicine</NavLink>
                            </li>

                            <li>
                                <NavLink to='/dashBoard/manageMedicine'>Manage Medicine</NavLink>
                            </li>
                            <li>
                                <NavLink to='/dashBoard/sellerPaymentHistory'>Seller Payment History</NavLink>
                            </li>

                        </>
                    }

                    {/* admin routes */}
                    {
                        !roleLoading && role == 'admin' &&
                        <>
                            <li>
                                <NavLink
                                    to="/dashboard/managePrescription"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "bg-primary text-white px-4 py-2 rounded"
                                            : "px-4 py-2 rounded hover:bg-gray-200"
                                    }
                                >
                                    Manage Prescription
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/makeAdmin"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "bg-primary text-white px-4 py-2 rounded"
                                            : "px-4 py-2 rounded hover:bg-gray-200"
                                    }
                                >
                                    Make Admin
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/manageCategory"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "bg-primary text-white px-4 py-2 rounded"
                                            : "px-4 py-2 rounded hover:bg-gray-200"
                                    }
                                >
                                    Manage Category
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/adminPayment"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "bg-primary text-white px-4 py-2 rounded"
                                            : "px-4 py-2 rounded hover:bg-gray-200"
                                    }
                                >
                                    admin Payment
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/report"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "bg-primary text-white px-4 py-2 rounded"
                                            : "px-4 py-2 rounded hover:bg-gray-200"
                                    }
                                >
                                    Report Admin
                                </NavLink>
                            </li>


                        </>
                    }


                </ul>
            </div>
        </div>
    );
};

export default DashBoardLayout;