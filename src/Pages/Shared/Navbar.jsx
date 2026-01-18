import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router'; 
import FirstLogo from './FirstLogo';
import UseAuth from '../../hook/UseAuth';
import { FaShoppingCart, FaSearch } from 'react-icons/fa';

// Note: UseQuery and Axios imports removed since Category is disabled

const Navbar = () => {
  const { logoutUser, user } = UseAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Search Functionality
  const handleSearch = (e) => {
    e.preventDefault();
    const text = e.target.search.value;
    if(text){
       navigate(`/shopPage?search=${text}`);
    } else{
       navigate('/shopPage')
    }
    e.target.reset();
  };

  const navLinks = (
    <>
      <li>
        <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? "text-emerald-400 font-bold" : "hover:text-emerald-400 transition-all font-medium"}
        >
            Home
        </NavLink>
      </li>
      <li>
        <NavLink 
            to="/shopPage" 
            className={({ isActive }) => isActive ? "text-emerald-400 font-bold" : "hover:text-emerald-400 transition-all font-medium"}
        >
            All Medicines
        </NavLink>
      </li>
      
      {/* Category Dropdown Removed for now */}
    </>
  );

  return (
    <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-[#0F172A]/90 backdrop-blur-md shadow-lg py-2" : "bg-[#0F172A] py-3"} text-white`}>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex items-center justify-between">
        
        {/* Left: Logo & Mobile Menu */}
        <div className="flex items-center gap-2">
          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-[#1E293B] rounded-box w-52 text-white">
              {navLinks}
              <div className="divider my-1"></div>
               {/* Mobile Search */}
               <form onSubmit={handleSearch} className="form-control px-2 mb-2">
                  <input type="text" name="search" placeholder="Search..." className="input input-bordered input-sm w-full bg-slate-800 text-white" />
               </form>
            </ul>
          </div>
          <FirstLogo />
        </div>

        {/* Center: Search Bar (Desktop) */}
        <div className="hidden lg:flex flex-1 justify-center items-center gap-8">
           <form onSubmit={handleSearch} className="relative w-full max-w-md">
              <input 
                type="text" 
                name="search"
                placeholder="Search medicine (e.g. Napa)..." 
                className="input input-bordered w-full h-10 rounded-full bg-slate-800 border-slate-600 focus:border-emerald-500 text-sm pl-4 pr-10 text-white placeholder-gray-400"
              />
              <button type="submit" className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-gray-400 hover:text-emerald-400">
                <FaSearch />
              </button>
           </form>
        </div>

        {/* Right Section: Links & Profile */}
        <div className="flex items-center gap-4">
            <ul className="menu menu-horizontal px-1 gap-4 hidden lg:flex text-sm">
                {navLinks}
            </ul>
            <Link to="/myCart" className="btn btn-ghost btn-circle relative">
              <FaShoppingCart className="text-xl" />
            </Link>
            
            {!user ? (
                <Link to="/login" className="btn bg-emerald-500 border-none text-white btn-sm rounded-full px-6">Join Us</Link>
            ) : (
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-emerald-500/30">
                        <div className="w-10 rounded-full">
                            <img src={user?.photoURL} alt="profile" />
                        </div>
                    </div>
                    <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-[#1E293B] rounded-box w-52 text-white border border-slate-700">
                        <li className="menu-title px-4 py-2 text-emerald-400 opacity-70">Hi, {user?.displayName?.split(' ')[0]}</li>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><Link to="/updateProfile">Settings</Link></li>
                        <li><button onClick={logoutUser} className="text-red-400">Logout</button></li>
                    </ul>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;