import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from 'react-router'; // react-router-dom হবে
import Swal from "sweetalert2";
import UseAxiosSecure from "../hook/UseAxiosSecure"; // প্রাইভেট কাজের জন্য
import UseAxiosPublic from "../hook/UseAxios"; // পাবলিক ডাটার জন্য
import UseAuth from "../hook/UseAuth";
import { FaCartPlus, FaEye, FaSortAmountDown } from 'react-icons/fa';

const Shop = () => {
  const axiosPublic = UseAxiosPublic(); // ✅ ডাটা লোড হবে এটা দিয়ে
  const axiosSecure = UseAxiosSecure(); // ✅ কার্ট হবে এটা দিয়ে
  const { user } = UseAuth();
  const [searchParams] = useSearchParams();
  
  const searchTerm = searchParams.get('search') || ''; 
  const [sortOrder, setSortOrder] = useState('default'); 

  // UseAxiosPublic ব্যবহার করে ডাটা আনা হচ্ছে
  const { data: medicines = [], isLoading, error } = useQuery({
    queryKey: ["medicines", searchTerm, sortOrder],
    queryFn: async () => {
      // ✅ axiosPublic ব্যবহার করো
      const res = await axiosPublic.get(`/medicines?search=${searchTerm}`);
      let data = res.data;

      if (sortOrder === 'lowToHigh') {
        data.sort((a, b) => a.price - b.price);
      } else if (sortOrder === 'highToHigh') {
        data.sort((a, b) => b.price - a.price);
      }
      return data;
    },
  });

  // Add to cart (Private - Requires Login)
  const handleSelect = async (medicine) => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to add items to cart",
        confirmButtonColor: "#10B981",
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
      image: medicine.medicineImage, // খেয়াল রেখো ডাটাবেসে ফিল্ডের নাম যেন ঠিক থাকে
      status: "pending",
    };

    try {
      // ✅ এখানে axiosSecure ঠিক আছে কারণ কার্ট সিকিউরড
      await axiosSecure.post("/carts", cartItem);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Added to Cart!",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Could not add to cart" });
    }
  };

  // ... (ShowDetails function and Return JSX same as before)
  // তোমার আগের কোডের বাকি অংশ ঠিক আছে, শুধু উপরের import আর হুক কল ঠিক করো।
  
  // নিচে আমি শুধু রেন্ডার অংশটা সংক্ষেপে দিচ্ছি যাতে কপি করতে সুবিধা হয়
  const showDetails = (medicine) => {
    Swal.fire({
      title: medicine.itemName,
      text: `Price: $${medicine.price}`,
      imageUrl: medicine.medicineImage || "https://via.placeholder.com/150",
      imageWidth: 200,
      imageHeight: 200,
    });
  };

  if (isLoading) return <div className="text-center mt-20">Loading...</div>;
  if (error) return <p className="text-center text-red-500 mt-10">Failed to load medicines.</p>;

  return (
    <div className="max-w-[1280px] mx-auto p-4 md:p-8 mt-16 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-slate-800">Available Medicines</h2>
        <div className="flex items-center gap-2">
            <FaSortAmountDown className="text-slate-500" />
            <select onChange={(e) => setSortOrder(e.target.value)} className="select select-bordered select-sm">
                <option value="default">Sort by Default</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToHigh">Price: High to Low</option>
            </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {medicines.map((medicine) => (
            <div key={medicine._id} className="card bg-white shadow-xl hover:shadow-2xl border border-slate-100">
              <figure className="px-4 pt-4 h-48">
                <img src={medicine.MedicineImage || "https://via.placeholder.com/150"} alt={medicine.itemName} className="rounded-xl h-full object-cover" />
              </figure>
              <div className="card-body p-4 items-center text-center">
                <h2 className="card-title">{medicine.itemName}</h2>
                <p className="text-sm text-gray-500">{medicine.company}</p>
                <p className="text-lg font-bold text-emerald-500">${medicine.price}</p>
                <div className="card-actions mt-2">
                  <button onClick={() => showDetails(medicine)} className="btn btn-sm btn-outline btn-info"><FaEye /> Details</button>
                  <button onClick={() => handleSelect(medicine)} className="btn btn-sm bg-emerald-500 text-white border-none"><FaCartPlus /> Add</button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Shop;