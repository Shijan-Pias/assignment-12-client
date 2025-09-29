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
                        isActive ? "text-primary font-semibold" : "hover:text-primary"
                    }
                >
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink to="/shopPage" className="hover:text-primary">
                    Shop
                </NavLink>
            </li>
             <li>
                <NavLink to="/category/:category" className="hover:text-primary">
                    Category Medicine
                </NavLink>
            </li>

        </>
    );


    return (
        <div className="bg-base-100 shadow-sm">
            {/* Container */}
            <div className="navbar max-w-[1280px] mx-auto px-6">

                {/* Left */}
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5" fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            {links}
                        </ul>
                    </div>
                    <FirstLogo />
                </div>

                {/* Center */}
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 gap-4">
                        {links}
                    </ul>
                </div>

                {/* Right */}
        <div className="navbar-end flex items-center gap-4">
          {/* Cart Icon */}
          <Link to="/myCart" className="relative">
            <FaShoppingCart className="text-2xl hover:text-primary" />
            
          </Link>

          {/* Languages dropdown */}
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost">
              🌐
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-100 rounded-box shadow w-32"
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
            <Link to="/login" className="btn btn-primary">
              Join Us
            </Link>
          ) : (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src={user?.photoURL || "/default-avatar.png"} alt="profile" />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-20 mt-3 w-52 p-2 shadow"
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
