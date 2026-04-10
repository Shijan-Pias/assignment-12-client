import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from 'react-router'; 
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import UseAxiosSecure from "../hook/UseAxiosSecure";
import UseAxiosPublic from "../hook/UseAxios"; 
import UseAuth from "../hook/UseAuth";
import { FaCartPlus, FaEye, FaSortAmountDown, FaSearch, FaMedkit } from 'react-icons/fa';

const Shop = () => {
  const axiosPublic = UseAxiosPublic();
  const axiosSecure = UseAxiosSecure();
  const { user } = UseAuth();
  const [searchParams] = useSearchParams();
  
  const searchTerm = searchParams.get('search') || ''; 
  const [sortOrder, setSortOrder] = useState('default'); 

  const { data: medicines = [], isLoading, error } = useQuery({
    queryKey: ["medicines", searchTerm, sortOrder],
    queryFn: async () => {
      const res = await axiosPublic.get(`/medicines?search=${searchTerm}`);
      let data = res.data;
      if (sortOrder === 'lowToHigh') data.sort((a, b) => a.price - b.price);
      else if (sortOrder === 'highToHigh') data.sort((a, b) => b.price - a.price);
      return data;
    },
  });

  const handleSelect = async (medicine) => {
    if (!user) {
      Swal.fire({
        title: "Join PharmaHub",
        text: "Please login to manage your medical cart",
        icon: "info",
        confirmButtonColor: "#10B981",
        background: "#ffffff",
        customClass: { popup: 'rounded-[2rem]' }
      });
      return;
    }

    const cartItem = {
      userEmail: user.email,
      sellerEmail: medicine.sellerEmail || "unknown@seller.com",
      medicineId: medicine._id,
      itemName: medicine.itemName,
      company: medicine.company,
      price: medicine.price,
      quantity: 1,
      image: medicine.MedicineImage,
      status: "pending",
    };

    try {
      await axiosSecure.post("/carts", cartItem);
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      Toast.fire({ icon: 'success', title: 'Added to your kit' });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Wait...", text: "Connection error. Try again." });
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-slate-50">
      <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium animate-pulse">Syncing Pharmacy Inventory...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* --- HERO SECTION --- */}
      <div className="bg-white border-b border-slate-100 pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-widest mb-4"
            >
              <FaMedkit /> Verified Prescriptions
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black text-slate-900 leading-tight"
            >
              PharmaHub <span className="text-emerald-500">Marketplace.</span>
            </motion.h1>
            <p className="text-slate-500 mt-4 text-lg font-medium italic">
              Authentic medications sourced directly from certified manufacturers.
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative group flex-1 md:w-64">
                <FaSortAmountDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                <select 
                  onChange={(e) => setSortOrder(e.target.value)} 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                >
                    <option value="default">Sort: Recommended</option>
                    <option value="lowToHigh">Price: Low to High</option>
                    <option value="highToHigh">Price: High to Low</option>
                </select>
            </div>
          </div>
        </div>
      </div>

      {/* --- GRID SECTION --- */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        {medicines.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <FaSearch size={40} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-xl font-bold text-slate-800">No matches found</h3>
            <p className="text-slate-500">Try adjusting your search terms</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {medicines.map((medicine, i) => (
                <motion.div
                  layout
                  key={medicine._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -10 }}
                  className="group bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500"
                >
                  <div className="relative h-56 rounded-[2rem] overflow-hidden bg-slate-50">
                    <img 
                      src={medicine.MedicineImage || "https://via.placeholder.com/300"} 
                      alt={medicine.itemName} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-black text-slate-900 shadow-sm">
                        {medicine.category || 'Medicine'}
                    </div>
                  </div>

                  <div className="px-2 pt-6 pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-black text-slate-800 leading-none group-hover:text-emerald-600 transition-colors uppercase tracking-tight">
                          {medicine.itemName}
                        </h3>
                        <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest leading-none">
                          {medicine.company}
                        </p>
                      </div>
                      <p className="text-2xl font-black text-emerald-500">
                        {medicine.price}৳
                      </p>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button 
                        onClick={() => handleSelect(medicine)}
                        className="flex-1 h-12 flex items-center justify-center gap-2 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-slate-200 active:scale-95"
                      >
                        <FaCartPlus /> Add to Cart
                      </button>
                      <button 
                        onClick={() => Swal.fire({ title: medicine.itemName, text: `Detailed pharmaceutical overview of ${medicine.itemName} goes here.`, imageUrl: medicine.MedicineImage, imageWidth: 400, customClass: { popup: 'rounded-[3rem]' } })}
                        className="w-12 h-12 flex items-center justify-center bg-slate-100 hover:bg-white border border-transparent hover:border-slate-200 text-slate-600 rounded-2xl transition-all active:scale-95"
                      >
                        <FaEye />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Shop;