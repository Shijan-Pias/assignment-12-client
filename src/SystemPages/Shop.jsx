import React, { useState, useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from 'react-router';
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import UseAxiosSecure from "../hook/UseAxiosSecure";
import UseAxiosPublic from "../hook/UseAxios";
import UseAuth from "../hook/UseAuth";
import { FaCartPlus, FaEye, FaSortAmountDown, FaSearch, FaMedkit, FaTimes } from 'react-icons/fa';

const Shop = () => {
  const axiosPublic = UseAxiosPublic();
  const axiosSecure = UseAxiosSecure();
  const { user } = UseAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchTerm = searchParams.get('search') || '';
  const [sortOrder, setSortOrder] = useState('default');
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMedicine, setSelectedMedicine] = useState(null); // Modal State

  const { data: medicines = [], isLoading } = useQuery({
    queryKey: ["medicines", searchTerm, sortOrder],
    queryFn: async () => {
      const res = await axiosPublic.get(`/medicines?search=${searchTerm}`);
      let data = res.data;
      if (sortOrder === 'lowToHigh') data.sort((a, b) => a.price - b.price);
      else if (sortOrder === 'highToLow') data.sort((a, b) => b.price - a.price);
      return data;
    },
  });

  // Category Logic
  const categories = useMemo(() => ["All", ...new Set(medicines.map(m => m.category || "General"))], [medicines]);

  const filteredMedicines = useMemo(() => {
    return selectedCategory === "All"
      ? medicines
      : medicines.filter(m => (m.category || "General") === selectedCategory);
  }, [medicines, selectedCategory]);

  const handleSelect = async (medicine) => {
    if (!user) {
      Swal.fire({
        title: "Join PharmaHub",
        text: "Please login to manage your medical cart",
        icon: "info",
        confirmButtonColor: "#10B981",
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
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2000, icon: 'success', title: 'Added to your kit' });
      setSelectedMedicine(null); // Close modal on add
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
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              PharmaHub <span className="text-emerald-500">Marketplace.</span>
            </h1>
          </div>
          <div className="relative group w-full md:w-64">
            <FaSortAmountDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none cursor-pointer"
            >
              <option value="default">Sort: Recommended</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- CATEGORY FILTER --- */}
      <div className="max-w-7xl mx-auto px-6 mt-10 flex flex-wrap gap-3 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full font-bold transition-all duration-300 border ${selectedCategory === cat
                ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20"
                : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-600"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* --- GRID SECTION --- */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredMedicines.map((medicine) => (
              <motion.div
                layout
                key={medicine._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-sm hover:shadow-2xl transition-all"
              >
                <div className="relative h-56 rounded-[2rem] overflow-hidden bg-slate-50">
                  <img src={medicine.MedicineImage} alt={medicine.itemName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="px-2 pt-6">
                  <h3 className="text-xl font-black text-slate-800 uppercase">{medicine.itemName}</h3>
                  <p className="text-emerald-500 font-bold text-lg mb-4">{medicine.price}৳</p>
                  <div className="flex gap-3">
                    <button onClick={() => handleSelect(medicine)} className="flex-1 h-12 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all"><FaCartPlus className="inline mr-2" /> Add</button>
                    <button
                      onClick={() => navigate(`/medicine/${medicine._id}`)}
                      className="w-12 h-12 flex items-center justify-center bg-slate-100 text-black hover:bg-slate-200 rounded-2xl transition-all"
                    >
                      <FaEye />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* --- DETAILS MODAL --- */}
      <AnimatePresence>
        {selectedMedicine && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setSelectedMedicine(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[2rem] p-8 w-full max-w-md relative z-10"
            >
              <button onClick={() => setSelectedMedicine(null)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full"><FaTimes /></button>
              <img src={selectedMedicine.MedicineImage} className="w-full h-64 object-cover rounded-2xl mb-6" alt={selectedMedicine.itemName} />
              <h2 className="text-2xl font-black text-slate-800 mb-2">{selectedMedicine.itemName}</h2>
              <p className="text-slate-500 mb-6">{selectedMedicine.description || "Pharmaceutical details for this medication are available in our records."}</p>
              <button onClick={() => handleSelect(selectedMedicine)} className="w-full h-12 bg-emerald-500 text-white font-bold rounded-xl">Add to Cart</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;