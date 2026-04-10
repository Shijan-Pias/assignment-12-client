import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay, Navigation } from "swiper/modules";
import { FaShoppingCart, FaEye, FaTimes, FaStar, FaArrowRight, FaTag } from "react-icons/fa";
import Swal from "sweetalert2";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";

import UseAxiosSecure from "../../hook/UseAxiosSecure";
import UseAuth from "../../hook/UseAuth";

const FeaturedMedicines = () => {
  const axiosSecure = UseAxiosSecure();
  const { user } = UseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const { data: medicines = [], isLoading } = useQuery({
    queryKey: ["medicines"],
    queryFn: async () => {
      const res = await axiosSecure.get("/medicines");
      return res.data;
    },
  });

  const handleAddToCart = async (medicine) => {
    if (!user?.email) {
      Swal.fire({
        title: "Authentication Required",
        text: "Please login to manage your pharmacy cart.",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#10B981",
        confirmButtonText: "Login",
      }).then((result) => {
        if (result.isConfirmed) navigate("/login", { state: { from: location.pathname } });
      });
      return;
    }

    const cartItem = {
      medicineId: medicine._id,
      userEmail: user.email,
      itemName: medicine.itemName,
      price: medicine.price,
      image: medicine.MedicineImage,
      quantity: 1,
    };

    try {
      const res = await axiosSecure.post("/carts", cartItem);
      if (res.data.insertedId) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Added to cart",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (isLoading) return <div className="h-96 flex items-center justify-center"><span className="loading loading-bars loading-lg text-emerald-500"></span></div>;

  return (
    <section className="relative py-16 bg-[#F8FAFC] overflow-hidden">
  

      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-100/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <motion.div 
            initial={{ x: -30, opacity: 0 }} 
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="h-[2px] w-12 bg-emerald-500"></span>
              <span className="text-emerald-600 font-bold uppercase tracking-widest text-sm">Best Sellers</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">Featured <span className="text-emerald-500">Collection</span></h2>
          </motion.div>

          <Link to="/shopPage">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-3 bg-white border-2 border-slate-200 px-8 py-3.5 rounded-2xl font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm"
            >
              Explore Full Shop <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </div>

        {/* Swiper Slider */}
        <motion.div variants={containerVars} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            autoplay={{ delay: 4000 }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={true}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            modules={[Pagination, Autoplay, Navigation]}
            className="featured-swiper !pb-16"
          >
            {medicines.map((med) => (
              <SwiperSlide key={med._id}>
                <motion.div 
                  variants={cardVars}
                  whileHover={{ y: -10 }}
                  className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col h-[480px]"
                >
                  {/* Image Container */}
                  <div className="relative h-60 bg-gradient-to-b from-slate-50 to-white p-8 flex items-center justify-center overflow-hidden">
                    <img
                      src={med.MedicineImage}
                      alt={med.itemName}
                      className="max-h-full w-auto object-contain group-hover:scale-110 transition-transform duration-700 z-10"
                    />
                    
                    {/* Floating Badges */}
                    {med.discount > 0 && (
                      <div className="absolute top-6 left-6 z-20 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                        <FaTag /> {med.discount}% OFF
                      </div>
                    )}

                    {/* Quick Action Overlay */}
                    <div className="absolute inset-0 bg-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] flex items-center justify-center gap-4 z-20">
                      <button onClick={() => setSelectedMedicine(med)} className="p-4 bg-white rounded-2xl text-emerald-600 shadow-xl hover:bg-emerald-600 hover:text-white transition-all">
                        <FaEye size={20} />
                      </button>
                      <button onClick={() => handleAddToCart(med)} className="p-4 bg-white rounded-2xl text-emerald-600 shadow-xl hover:bg-emerald-600 hover:text-white transition-all">
                        <FaShoppingCart size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{med.category}</span>
                      <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{med.company}</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1">
                      {med.itemName}
                    </h3>

                    <div className="flex items-center gap-1 text-amber-400 mb-6">
                      <FaStar size={12} /><FaStar size={12} /><FaStar size={12} /><FaStar size={12} />
                      <FaStar className="text-slate-200" size={12} />
                      <span className="text-slate-400 text-xs font-bold ml-2">4.8</span>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-6">
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase">Best Price</span>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-black text-slate-900">৳{med.price}</span>
                          {med.discount > 0 && (
                            <span className="text-sm text-slate-300 line-through font-bold">৳{Math.round(med.price * 1.2)}</span>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleAddToCart(med)}
                        className="bg-emerald-100 text-emerald-700 p-4 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-inner"
                      >
                        <FaShoppingCart />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>

      {/* --- Apple Style Quick View Modal --- */}
      <AnimatePresence>
        {selectedMedicine && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col md:flex-row"
            >
              <button onClick={() => setSelectedMedicine(null)} className="absolute top-8 right-8 z-50 p-3 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors text-slate-500">
                <FaTimes size={20} />
              </button>

              <div className="md:w-1/2 bg-slate-50 p-12 flex items-center justify-center">
                <img src={selectedMedicine.MedicineImage} className="max-h-[400px] w-auto drop-shadow-2xl" alt="" />
              </div>

              <div className="md:w-1/2 p-12 flex flex-col">
                <div className="mb-8">
                  <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase mb-4 tracking-tighter">
                    Premium Quality
                  </span>
                  <h2 className="text-4xl font-black text-slate-900 mb-2">{selectedMedicine.itemName}</h2>
                  <p className="text-slate-400 font-bold tracking-wide">Generic: {selectedMedicine.genericName}</p>
                </div>

                <p className="text-slate-500 leading-relaxed mb-10 text-lg">
                  {selectedMedicine.description || "A high-performance pharmaceutical product formulated for effective results under verified clinical standards."}
                </p>

                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-1">Unit Price</span>
                    <span className="text-5xl font-black text-emerald-600">৳{selectedMedicine.price}</span>
                  </div>
                  <button onClick={() => handleAddToCart(selectedMedicine)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-5 rounded-[2rem] font-black shadow-xl shadow-emerald-200 flex items-center gap-3 transition-transform active:scale-95">
                    <FaShoppingCart /> Buy Now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FeaturedMedicines;