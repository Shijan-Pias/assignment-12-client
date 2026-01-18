import React from 'react';
import { motion } from 'framer-motion'; 
import { FaSearch, FaShippingFast, FaUserMd, FaShieldAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router';

const Banner = () => {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const text = e.target.search.value;
    if (text) {
      navigate(`/shopPage?search=${text}`);
    }
    else{
      navigate('/shopPage')
        }
  };

  return (
    // FIX: Added 'pt-24 md:pt-32' to push content below the navbar
    <div className="relative bg-gradient-to-br from-slate-50 to-emerald-50 min-h-[85vh] flex items-center pt-24 md:pt-32 overflow-hidden">
      
      {/* Background Shapes */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-100/40 skew-x-12 translate-x-20 z-0"></div>
      <div className="absolute bottom-0 left-10 w-64 h-64 bg-teal-100/50 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Side: Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            No.1 Online Pharmacy Service
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 leading-tight">
            Your Health, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">
              Our Priority.
            </span>
          </h1>

          <p className="text-lg text-slate-500 max-w-lg">
            Get genuine medicines, supplements, and healthcare products delivered to your doorstep within 24 hours.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative w-full max-w-lg shadow-xl shadow-emerald-100/50 rounded-full">
            <input 
              type="text" 
              name="search"
              placeholder="Search for medicines (e.g. Paracetamol)..." 
              className="input input-lg w-full rounded-full pl-6 pr-16 border-2 border-transparent focus:border-emerald-500 focus:outline-none bg-white text-slate-700"
            />
            <button type="submit" className="absolute right-2 top-2 btn btn-circle bg-emerald-500 hover:bg-emerald-600 text-white border-none">
              <FaSearch className="text-lg" />
            </button>
          </form>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                <FaShippingFast className="text-2xl text-emerald-500 mb-2"/>
                <span className="font-bold text-slate-700">Fast</span>
                <span className="text-xs text-slate-400">Delivery</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                <FaShieldAlt className="text-2xl text-emerald-500 mb-2"/>
                <span className="font-bold text-slate-700">100%</span>
                <span className="text-xs text-slate-400">Genuine</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                <FaUserMd className="text-2xl text-emerald-500 mb-2"/>
                <span className="font-bold text-slate-700">Expert</span>
                <span className="text-xs text-slate-400">Support</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative w-full h-[500px] flex items-center justify-center">
             <div className="absolute w-[450px] h-[450px] bg-emerald-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
             <div className="absolute w-[450px] h-[450px] bg-teal-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000 left-10"></div>
             
             {/* Replace this URL with your desired transparent image */}
             <img 
               src="https://img.freepik.com/free-photo/happy-young-female-doctor-using-tablet-computer-looking-camera_171337-1555.jpg" 
               className="relative z-10 w-[400px] h-[500px] object-cover rounded-3xl shadow-2xl mask mask-squircle" 
               alt="Doctor" 
             />

             {/* Floating Cards */}
             <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-20 -left-10 z-20 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50 flex items-center gap-3"
             >
                <div className="bg-green-100 p-2 rounded-full text-green-600"><FaShieldAlt /></div>
                <div>
                    <p className="text-xs text-slate-500">Quality</p>
                    <p className="font-bold text-slate-800">Verified</p>
                </div>
             </motion.div>

             <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute bottom-10 -right-5 z-20 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50 flex items-center gap-3"
             >
                <div className="bg-blue-100 p-2 rounded-full text-blue-600"><FaShippingFast /></div>
                <div>
                    <p className="text-xs text-slate-500">Delivery</p>
                    <p className="font-bold text-slate-800">30 Mins</p>
                </div>
             </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Banner;