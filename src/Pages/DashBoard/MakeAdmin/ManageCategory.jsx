import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaTrash, FaEdit, FaPills, FaBoxes, FaFlask, FaIndustry } from "react-icons/fa";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UseAxiosSecure from "../../../hook/UseAxiosSecure";

const ManageMedicines = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentMedicine, setCurrentMedicine] = useState(null);
  const [saving, setSaving] = useState(false);
  const axiosInstance = UseAxiosSecure();

  // --- CALCULATION STATES ---
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [calculatedFinalPrice, setCalculatedFinalPrice] = useState(0);

  useEffect(() => {
    if (currentMedicine) {
      setPrice(currentMedicine.price || 0);
      setDiscount(currentMedicine.discount || 0);
      setCalculatedFinalPrice(currentMedicine.finalPrice || 0);
    }
  }, [currentMedicine]);

  useEffect(() => {
    const final = price - (price * discount) / 100;
    setCalculatedFinalPrice(final > 0 ? final : 0);
  }, [price, discount]);

  const { data: medicines = [], isLoading } = useQuery({
    queryKey: ["allMedicines"],
    queryFn: async () => {
      const res = await axiosInstance.get("/medicines");
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/medicines/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["allMedicines"]);
      Swal.fire({ icon: "success", title: "Deleted!", toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      setSaving(true);
      const res = await axiosInstance.patch(`/medicines/${id}`, data);
      setSaving(false);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allMedicines"]);
      Swal.fire({ icon: "success", title: "Updated Successfully" });
      setModalOpen(false);
      setCurrentMedicine(null);
    },
  });

  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedData = {
      itemName: form.itemName.value,
      genericName: form.genericName.value,
      category: form.category.value,
      company: form.company.value,
      massUnit: currentMedicine.massUnit,
      price: Number(price),
      discount: Number(discount),
      finalPrice: Number(calculatedFinalPrice),
    };
    updateMutation.mutate({ id: currentMedicine._id, data: updatedData });
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-4 md:p-10 bg-[#0f172a] min-h-screen text-slate-300 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Inventory Console</h2>
            <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold text-center md:text-left">Admin Pharmaceutical Control</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 flex items-center gap-4">
             <FaBoxes className="text-emerald-500 text-2xl"/>
             <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total SKU</p>
                <p className="text-xl font-black text-white">{medicines.length}</p>
             </div>
          </div>
        </header>

        {/* --- RESTORED MEDICINE GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {medicines.map((med, index) => (
              <motion.div
                layout
                key={med._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-[2rem] p-6 hover:border-emerald-500/50 transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl"><FaPills size={20}/></div>
                  <span className="px-3 py-1 bg-slate-900 text-emerald-500 text-[10px] font-black uppercase rounded-full tracking-widest border border-emerald-500/20">
                    {med.category}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{med.itemName}</h3>
                  <div className="flex flex-col gap-1 text-sm text-slate-400">
                     <span className="flex items-center gap-2"><FaFlask className="text-slate-600" size={12}/> {med.genericName}</span>
                     <span className="flex items-center gap-2"><FaIndustry className="text-slate-600" size={12}/> {med.company}</span>
                  </div>

                  <div className="pt-4 border-t border-slate-700/50 flex items-end justify-between">
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase">Settlement Price</p>
                        <p className="text-2xl font-black text-white">{med.finalPrice}৳</p>
                    </div>
                    {med.discount > 0 && (
                        <div className="text-right">
                           <p className="text-[10px] font-bold text-rose-500 uppercase">{med.discount}% Discount</p>
                           <p className="text-xs text-slate-500 line-through">{med.price}৳</p>
                        </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button onClick={() => { setCurrentMedicine(med); setModalOpen(true); }} className="flex-1 bg-slate-900 hover:bg-emerald-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all"><FaEdit size={14}/> Edit</button>
                  <button onClick={() => deleteMutation.mutate(med._id)} className="w-12 h-12 bg-slate-900 hover:bg-rose-600 text-slate-500 hover:text-white rounded-xl flex items-center justify-center transition-all"><FaTrash size={14}/></button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* --- EDIT MODAL --- */}
      <AnimatePresence>
        {modalOpen && currentMedicine && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.form
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              onSubmit={handleSave}
              className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-2xl font-black text-white tracking-tight">Edit SKU Details</h3>
                 <FaFlask className="text-emerald-500 text-3xl opacity-20" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-500 uppercase px-2">Medicine Name</label>
                   <input name="itemName" defaultValue={currentMedicine.itemName} className="w-full bg-slate-800 border-none rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none" required />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-500 uppercase px-2">Generic Composition</label>
                   <input name="genericName" defaultValue={currentMedicine.genericName} className="w-full bg-slate-800 border-none rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-500 uppercase px-2">Category</label>
                   <input name="category" defaultValue={currentMedicine.category} className="w-full bg-slate-800 border-none rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-500 uppercase px-2">Manufacturer</label>
                   <input name="company" defaultValue={currentMedicine.company} className="w-full bg-slate-800 border-none rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>

                {/* --- CALCULATION FIELDS --- */}
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-500 uppercase px-2">Market Price (৳)</label>
                   <input 
                      type="number" 
                      value={price} 
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-slate-800 border-none rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none" 
                    />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-500 uppercase px-2">Discount (%)</label>
                   <input 
                      type="number" 
                      value={discount} 
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="w-full bg-slate-800 border-none rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none" 
                    />
                </div>

                <div className="space-y-1 md:col-span-2">
                   <label className="text-[10px] font-black text-emerald-500 uppercase px-2">Final Settlement Price (৳)</label>
                   <div className="w-full bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-4 py-3 text-emerald-400 font-black text-xl">
                      {calculatedFinalPrice.toFixed(2)}৳
                   </div>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button type="submit" disabled={saving} className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-emerald-900/20">
                  {saving ? "Processing..." : "Confirm Update"}
                </button>
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 bg-slate-800 text-slate-400 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">
                  Discard
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageMedicines;