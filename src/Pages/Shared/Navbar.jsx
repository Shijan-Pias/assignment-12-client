import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router'; 
import { motion, AnimatePresence } from 'framer-motion';
// ✅ Fixed: Changed FaLayout to FaThLarge
import { FaShoppingCart, FaSearch, FaChevronDown, FaUserCircle, FaSignOutAlt, FaThLarge } from 'react-icons/fa';
import { useQuery } from "@tanstack/react-query";
import FirstLogo from './FirstLogo';
import UseAuth from '../../hook/UseAuth';
import UseAxiosSecure from '../../hook/UseAxiosSecure';

const Navbar = () => {
  const { logoutUser, user } = UseAuth();
  const axiosSecure = UseAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const { data: cart = [] } = useQuery({
    queryKey: ["carts", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
        const res = await axiosSecure.get(`/carts?userEmail=${user.email}`);
        return res.data;
    },
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const text = e.target.search.value;
    navigate(text ? `/shopPage?search=${text}` : '/shopPage');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Medicines', path: '/shopPage' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
        ? "bg-slate-950/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] py-2" 
        : "bg-slate-950 py-5"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between gap-8 text-white">
        
        <motion.div 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          className="shrink-0 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <FirstLogo />
        </motion.div>

        <div className="hidden lg:flex items-center flex-1 justify-center gap-10">
          <ul className="flex items-center gap-8 text-sm font-semibold tracking-wide">
            {navLinks.map((link) => (
              <li key={link.path} className="relative group">
                <NavLink 
                  to={link.path} 
                  className={({ isActive }) => 
                    `transition-colors duration-300 ${isActive ? "text-emerald-400" : "text-slate-300 hover:text-white"}`
                  }
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div 
                      layoutId="navUnderline"
                      className="absolute -bottom-1 left-0 w-full h-0.5 bg-emerald-400 rounded-full"
                    />
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <form 
            onSubmit={handleSearch} 
            className={`relative flex-1 transition-all duration-500 ease-out ${isSearchFocused ? "max-w-[400px]" : "max-w-[280px]"}`}
          >
            <div className={`absolute inset-y-0 left-4 flex items-center transition-colors ${isSearchFocused ? "text-emerald-400" : "text-slate-500"}`}>
              <FaSearch size={14} />
            </div>
            <input 
              type="text" 
              name="search"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Find medication..." 
              className="w-full h-11 bg-slate-900/50 border border-slate-700/50 rounded-2xl pl-11 pr-4 text-sm outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all text-white placeholder-slate-500"
            />
          </form>
        </div>

        <div className="flex items-center gap-5">
          <Link to="/myCart" className="relative p-3 bg-slate-900/50 rounded-2xl hover:bg-slate-800 transition-all border border-slate-800/50 group active:scale-90">
            <FaShoppingCart className="text-slate-300 group-hover:text-emerald-400 transition-colors" size={18} />
            <AnimatePresence>
              {cart?.length > 0 && (
                <motion.span 
                  initial={{ scale: 0, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }} 
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-1 -right-1 bg-emerald-500 text-[10px] font-black text-slate-950 h-5 w-5 rounded-full flex items-center justify-center border-2 border-slate-950 shadow-lg"
                >
                  {cart.length}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          
          {!user ? (
            <Link to="/login">
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] uppercase tracking-[0.15em] px-7 py-3.5 rounded-2xl transition-all shadow-xl shadow-emerald-500/10"
              >
                Get Started
              </motion.button>
            </Link>
          ) : (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="group flex items-center gap-2 p-1 pr-3 bg-slate-900/50 rounded-full border border-slate-800/50 hover:border-emerald-500/30 transition-all cursor-pointer">
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-500/20 group-hover:border-emerald-500/50 transition-colors">
                  <img src={user?.photoURL} alt="user" className="w-full h-full object-cover" />
                </div>
                <FaChevronDown size={10} className="text-slate-500 group-hover:text-emerald-400 transition-transform duration-300 group-focus:rotate-180" />
              </div>

              <motion.ul 
                tabIndex={0} 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="dropdown-content mt-4 z-[1] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-slate-950 border border-slate-800 rounded-[1.5rem] w-64 overflow-hidden"
              >
                <div className="px-4 py-4 border-b border-slate-800/50 bg-slate-900/30">
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Authenticated Account</p>
                   <p className="text-sm font-bold text-white truncate">{user?.displayName}</p>
                </div>
                
                <div className="p-1 space-y-1 mt-1 list-none text-left">
                    <li><Link to="/dashboard" className="flex items-center gap-3 p-3 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 rounded-xl transition-all font-medium text-sm">
                      <FaThLarge size={14}/> Dashboard Console
                    </Link></li>
                    <li><Link to="/updateProfile" className="flex items-center gap-3 p-3 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 rounded-xl transition-all font-medium text-sm">
                      <FaUserCircle size={14}/> Security Settings
                    </Link></li>
                </div>
                
                <div className="divider before:bg-slate-800 after:bg-slate-800 my-0 px-2"></div>
                
                <div className="p-1 list-none text-left">
                    <li><button onClick={logoutUser} className="flex items-center gap-3 p-3 w-full text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all font-bold text-sm">
                      <FaSignOutAlt size={14}/> End Session
                    </button></li>
                </div>
              </motion.ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;