import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { MdLocalFireDepartment, MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router'; // Fix 1 & 3
import Swal from 'sweetalert2';

import UseAxios from "../../hook/UseAxios";
import UseAxiosSecure from '../../hook/UseAxiosSecure'; // Fix 2
import UseAuth from '../../hook/UseAuth';

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const DiscountProducts = () => {
  const axiosInstance = UseAxios();
  const axiosSecure = UseAxiosSecure(); // Fix 2: Initialize hook
  const { user } = UseAuth();
  const navigate = useNavigate(); // Fix 1: Initialize navigate
  const location = useLocation(); // Fix 3: Initialize location

  const { data: discountMedicines = [], isLoading } = useQuery({
    queryKey: ["discountMedicines"],
    queryFn: async () => {
      const res = await axiosInstance.get("/medicines");
      return res.data.filter((med) => med.discount > 0);
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
        // Fix 1: Change Navigate to navigate
        if (result.isConfirmed) navigate("/login", { state: { from: location.pathname } });
      });
      return;
    }

    // Calculate actual price after discount
    const discountPrice = medicine.price - (medicine.price * medicine.discount / 100);

    const cartItem = {
      medicineId: medicine._id,
      userEmail: user.email,
      itemName: medicine.itemName,
      price: discountPrice, // Fix 4: Save the discounted price
      image: medicine.MedicineImage,
      quantity: 1,
    };

    try {
      const res = await axiosSecure.post("/carts", cartItem); // Use initialized axiosSecure
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

  if (isLoading) return (
    <div className="h-64 flex items-center justify-center">
      <span className="loading loading-ring loading-lg text-rose-500"></span>
    </div>
  );

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-[100px] -z-10" />

      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-rose-600 mb-2 font-black uppercase tracking-tighter">
              <MdLocalFireDepartment size={24} className="animate-bounce" />
              <span>Limited Time Offers</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">
              Flash <span className="text-rose-500">Deals</span>
            </h2>
          </div>

          <div className="flex gap-3">
            <button className="prev-btn w-12 h-12 rounded-2xl border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-rose-500 hover:text-rose-500 transition-all shadow-sm bg-white">
              <MdOutlineArrowBackIos className="ml-1" />
            </button>
            <button className="next-btn w-12 h-12 rounded-2xl border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-rose-500 hover:text-rose-500 transition-all shadow-sm bg-white">
              <MdOutlineArrowForwardIos />
            </button>
          </div>
        </div>

        {discountMedicines.length === 0 ? (
          <div className="bg-slate-50 rounded-[2rem] p-20 text-center border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold">More deals coming soon! Stay tuned.</p>
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 5000 }}
            navigation={{ prevEl: '.prev-btn', nextEl: '.next-btn' }}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="discount-swiper !pb-14"
          >
            {discountMedicines.map((med) => (
              <SwiperSlide key={med._id}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-[2.5rem] border border-slate-100 p-6 h-full relative group shadow-xl shadow-slate-200/40"
                >
                  <div className="absolute top-6 right-6 z-20 bg-rose-500 text-white font-black px-4 py-2 rounded-2xl text-xs shadow-lg shadow-rose-200 animate-pulse">
                    {med.discount}% OFF
                  </div>

                  <div className="h-48 bg-slate-50 rounded-[2rem] mb-6 flex items-center justify-center p-6 relative overflow-hidden group-hover:bg-rose-50 transition-colors duration-500">
                    <img
                      src={med.MedicineImage || "https://via.placeholder.com/150"}
                      alt={med.itemName}
                      className="max-h-full w-auto object-contain transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  <div className="space-y-2 text-left">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {med.category}
                    </span>
                    <h3 className="font-bold text-xl text-slate-800 line-clamp-1 group-hover:text-rose-600 transition-colors">
                      {med.itemName}
                    </h3>
                    <p className="text-xs font-medium text-slate-400 italic">
                      {med.genericName}
                    </p>

                    <div className="pt-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black text-slate-900 leading-none">
                            ৳{Math.round(med.price - (med.price * med.discount / 100))}
                          </span>
                        </div>
                        <span className="text-sm text-slate-300 line-through font-bold">
                          ৳{med.price}
                        </span>
                      </div>

                     <button 
                        onClick={() => handleAddToCart(med)} 
                        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-rose-500 transition-colors shadow-lg shadow-slate-200"
                      >
                         <FaShoppingCart /> Buy
                      </button>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default DiscountProducts;