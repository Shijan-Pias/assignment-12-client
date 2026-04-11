import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UseAuth from "../../../hook/UseAuth";
import UseAxiosSecure from "../../../hook/UseAxiosSecure";
import Swal from "sweetalert2";
import { FaTrash, FaPills, FaTag, FaFlask, FaBuilding, FaSearch, FaBoxOpen } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ManageMedicines = () => {
  const axiosSecure = UseAxiosSecure();
  const { user } = UseAuth();
  const queryClient = useQueryClient();
  const sellerEmail = user?.email;

  const { data: medicines = [], isLoading } = useQuery({
    queryKey: ["sellerMedicines", sellerEmail],
    queryFn: async () => {
      const res = await axiosSecure.get(`/medicines?sellerEmail=${sellerEmail}`);
      return res.data;
    },
    enabled: !!sellerEmail,
  });

  const deleteMutation = useMutation({
    mutationFn: (medicineId) => axiosSecure.delete(`/medicines/${medicineId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["sellerMedicines", sellerEmail]);
      Swal.fire({
        icon: "success",
        title: "Item Removed",
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    },
  });

  const handleDelete = (medicineId) => {
    Swal.fire({
      title: "Remove Medication?",
      text: "This action cannot be undone from your inventory.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete",
      customClass: { popup: 'rounded-[1.5rem]' }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(medicineId);
      }
    });
  };

  if (isLoading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
      <p className="text-slate-500 animate-pulse font-medium">Retrieving Inventory...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen font-sans">
      <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <FaBoxOpen className="text-emerald-500" /> Manage Medicines
          </h2>
          <p className="text-slate-500 text-sm mt-1">Control your listings, pricing, and stock availability.</p>
        </div>
        
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Listings</p>
           <p className="text-2xl font-black text-slate-900">{medicines.length}</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        {medicines.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-20 text-center border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaSearch size={30} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Your Shelf is Empty</h3>
            <p className="text-slate-500 mt-2">Start adding medications to see them listed here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {medicines.map((med, index) => (
                <motion.div
                  key={med._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="group bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shadow-inner">
                      <FaPills size={22} />
                    </div>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded-full tracking-widest">
                      {med.category}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-black text-xl text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors">
                        {med.itemName}
                      </h3>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter mt-1 flex items-center gap-1">
                        <FaFlask size={10} /> {med.genericName}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <FaBuilding className="text-slate-300" />
                            <span className="truncate font-medium">{med.company}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm justify-end font-bold">
                            <FaTag className="text-slate-300" />
                            <span>{med.massUnit}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <div>
                            <p className="text-[10px] text-slate-400 font-black uppercase">Market Price</p>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-black text-slate-900">{med.finalPrice}৳</span>
                                {med.discount > 0 && (
                                    <span className="text-xs text-slate-300 line-through">৳{med.price}</span>
                                )}
                            </div>
                        </div>
                        {med.discount > 0 && (
                            <div className="bg-red-50 text-red-500 text-[10px] font-black px-2 py-1 rounded-lg border border-red-100">
                                -{med.discount}% OFF
                            </div>
                        )}
                    </div>

                    <button
                      onClick={() => handleDelete(med._id)}
                      className="w-full mt-4 bg-amber-500 text-black hover:bg-red-50 hover:text-red-500 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all font-bold text-sm"
                    >
                      <FaTrash size={14} /> Remove Listing
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageMedicines;