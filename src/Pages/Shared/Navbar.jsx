import React from 'react';
import { Link, NavLink } from 'react-router';
import FirstLogo from './FirstLogo';
import UseAuth from '../../hook/UseAuth';
import { FaShoppingCart } from 'react-icons/fa';

const Navbar = () => {
  const { logoutUser, user } = UseAuth();
  const links = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-secondary font-semibold"
              : "hover:text-secondary transition-colors duration-200"
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/shopPage" className="hover:text-secondary transition-colors duration-200">
          Shop
        </NavLink>
      </li>
      <li>
        <NavLink to="/category/:category" className="hover:text-secondary transition-colors duration-200">
          Category Medicine
        </NavLink>
      </li>

    </>
  );


  return (
    <div className="bg-[#0F172A] text-white w-full fixed top-0 left-0 z-50 shadow-lg ">
      {/* Full-width sticky/fixed navbar */}
      <div className="navbar max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 -mb-2">
        {/* Left Section */}
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost text-white lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </div>

            {/* Mobile dropdown */}
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-[#1E293B] rounded-lg mt-3 w-52 p-2 shadow-lg text-white"
            >
              {links}
              {!user ? (
                <li>
                  <Link to="/login" className="text-secondary font-semibold">
                    Join Us
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/updateProfile">Update Profile</Link>
                  </li>
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <button onClick={logoutUser}>Logout</button>
                  </li>
                </>
              )}
            </ul>
          </div>

          <FirstLogo />
        </div>

        {/* Center Section */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-6 text-sm font-medium">
            {links}
          </ul>
        </div>

        {/* Right Section */}
        <div className="navbar-end flex items-center gap-4">
          {/* Cart */}
          <Link to="/myCart" className="relative">
            <FaShoppingCart className="text-2xl hover:text-secondary transition-colors duration-200" />
          </Link>

          {/* Language Dropdown */}
          <div className="dropdown dropdown-end hidden sm:block">
            <label tabIndex={0} className="btn btn-ghost btn-sm text-white">
              🌐
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-[#1E293B] rounded-lg mt-3 w-32 shadow-lg text-white"
            >
              <li>
                <button>English</button>
              </li>
              <li>
                <button>বাংলা</button>
              </li>
            </ul>
          </div>

          {/* Auth */}
          {!user ? (
            <Link
              to="/login"
              className="btn bg-secondary border-none text-white hover:bg-secondary/90 btn-sm"
            >
              Join Us
            </Link>
          ) : (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={user?.photoURL || "/default-avatar.png"}
                    alt="profile"
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-[#1E293B] rounded-lg mt-3 w-52 p-2 shadow-lg text-white"
              >
                <li>
                  <Link to="/updateProfile">Update Profile</Link>
                </li>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <button onClick={logoutUser}>Logout</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default Navbar;