import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from "@tanstack/react-query";
import { FaArrowLeft, FaCartPlus, FaCheckCircle, FaBuilding, FaTag } from 'react-icons/fa';
import UseAxiosPublic from "../hook/UseAxios";
import UseAxiosSecure from "../hook/UseAxiosSecure";
import UseAuth from "../hook/UseAuth";
import Swal from "sweetalert2";

const MedicineDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPublic = UseAxiosPublic();
  const axiosSecure = UseAxiosSecure();
  const { user } = UseAuth();

  const { data: medicine = {}, isLoading } = useQuery({
    queryKey: ["medicine", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/medicines/${id}`);
      return res.data;
    },
  });

  const handleAddToCart = async () => {
    if (!user) return Swal.fire("Login Required", "Please login to add items.", "info");
    
    const cartItem = {
      userEmail: user.email,
      sellerEmail: medicine.sellerEmail,
      medicineId: medicine._id,
      itemName: medicine.itemName,
      price: medicine.price,
      image: medicine.MedicineImage,
      quantity: 1,
    };
    
    await axiosSecure.post("/carts", cartItem);
    Swal.fire({ icon: 'success', title: 'Added to Kit', toast: true, position: 'top-end' });
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-6">
      <div className="max-w-5xl mx-auto mt-20">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors font-medium"
        >
          <FaArrowLeft /> Back to Shop
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 grid grid-cols-1 md:grid-cols-2">
          
          {/* Image Section: Responsive Height */}
          <div className="relative h-80 md:h-full w-full">
            <img 
              src={medicine.MedicineImage} 
              alt={medicine.itemName} 
              className="w-full h-full object-cover" 
            />
            {/* Overlay badge on mobile */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-emerald-600 uppercase flex items-center gap-1">
              <FaCheckCircle /> Verified
            </div>
          </div>

          {/* Info Section */}
          <div className="p-6 md:p-12 flex flex-col justify-center">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase leading-tight mb-2">
              {medicine.itemName}
            </h1>
            <p className="text-2xl font-bold text-emerald-500 mb-6">{medicine.price}৳</p>
            
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="flex items-center gap-2 text-slate-600 bg-slate-100 px-4 py-2 rounded-xl text-sm font-semibold"> 
                <FaBuilding /> {medicine.company}
              </span>
              <span className="flex items-center gap-2 text-slate-600 bg-slate-100 px-4 py-2 rounded-xl text-sm font-semibold"> 
                <FaTag /> {medicine.category}
              </span>
            </div>

            <h4 className="font-bold text-slate-800 mb-2">Pharmaceutical Overview</h4>
            <p className="text-slate-500 leading-relaxed mb-8 text-base">
              {medicine.description || "Detailed information about this medicine is currently being updated by our verified pharmaceutical partners."}
            </p>

            <button 
              onClick={handleAddToCart} 
              className="w-full py-4 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <FaCartPlus /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetails;