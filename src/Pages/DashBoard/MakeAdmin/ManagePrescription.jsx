import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { 
  FaEye, 
  FaCheckCircle, 
  FaPlus, 
  FaTrashAlt, 
  FaSearch, 
  FaFilePrescription, 
  FaUserCircle, 
  FaClock, 
  FaShieldAlt,
  FaTimes
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import UseAxios from '../../../hook/UseAxios';
import UseAxiosSecure from '../../../hook/UseAxiosSecure';

const ManagePrescriptions = () => {
    const axiosSecure = UseAxiosSecure();
    const axiosInstance = UseAxios();
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [searchMedicine, setSearchMedicine] = useState('');
    const [addedMedicines, setAddedMedicines] = useState([]);
    const [foundMedicines, setFoundMedicines] = useState([]);

    const { data: prescriptions = [], refetch, isLoading } = useQuery({
        queryKey: ['all-prescriptions'],
        queryFn: async () => {
            const res = await axiosSecure.get('/prescriptions/admin');
            return res.data;
        }
    });

    const handleSearchMedicine = async (e) => {
        if (e) e.preventDefault();
        if (!searchMedicine.trim()) return;
        
        try {
            const res = await axiosInstance.get(`/medicines?search=${searchMedicine}`);
            setFoundMedicines(res.data);
        } catch (error) {
            console.error("Search failed:", error);
        }
    };

    const handleAddMedicine = (med) => {
        const alreadyAdded = addedMedicines.find(m => m._id === med._id);
        if (!alreadyAdded) {
            setAddedMedicines([...addedMedicines, { ...med, quantity: 1 }]);
        }
    };

    const handleRemoveMedicine = (id) => {
        setAddedMedicines(addedMedicines.filter(m => m._id !== id));
    };

    const handleConfirmOrder = async () => {
        if (addedMedicines.length === 0) {
            return Swal.fire("Required", "Please add at least one medicine", "warning");
        }

        const updateInfo = { medicines: addedMedicines, status: "confirmed" };
        const res = await axiosSecure.patch(`/prescriptions/${selectedPrescription._id}/update`, updateInfo);
        
        if(res.data.modifiedCount > 0){
            Swal.fire({
                icon: "success",
                title: "Prescription Processed",
                text: "User notified and medicines added to order.",
                confirmButtonColor: "#10b981"
            });
            refetch();
            document.getElementById('details_modal').close();
            setAddedMedicines([]);
        }
    };

    const openModal = (pres) => {
        setSelectedPrescription(pres);
        setAddedMedicines([]);
        setFoundMedicines([]);
        setSearchMedicine('');
        document.getElementById('details_modal').showModal();
    }

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <span className="loading loading-spinner loading-lg text-emerald-500"></span>
        </div>
    );

    return (
        <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
            <header className="max-w-7xl mx-auto mb-10">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <FaShieldAlt className="text-emerald-500" /> Pharmacy Verification
                </h2>
                <p className="text-slate-500 text-sm mt-1 font-bold uppercase tracking-widest">Prescription Audit Control</p>
            </header>
            
            <div className="max-w-7xl mx-auto bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="table w-full border-separate border-spacing-0">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-8 py-5 text-[10px] font-black text-slate-800 uppercase tracking-widest">Order Details</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-800 uppercase tracking-widest text-center">Submission Date</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-800 uppercase tracking-widest text-center">Verification Status</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-800 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {prescriptions.map((pres) => (
                            <motion.tr 
                                key={pres._id}
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="hover:bg-slate-50/50 transition-colors group"
                            >
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                                            <FaUserCircle size={24} />
                                        </div>
                                        <span className="font-bold text-slate-900">{pres.userEmail}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-center text-slate-600">
                                    <span className="font-bold flex items-center justify-center gap-1">
                                        <FaClock size={12}/> {new Date(pres.createdAt).toLocaleDateString('en-GB')}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight border ${
                                        pres.status === 'pending' 
                                            ? 'bg-amber-50 text-amber-700 border-amber-200' 
                                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    }`}>
                                        <FaCheckCircle size={10} /> {pres.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    {pres.status === 'pending' ? (
                                        <button onClick={() => openModal(pres)} className="bg-slate-900 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold transition-all transform active:scale-95 flex items-center gap-2 ml-auto text-xs shadow-lg shadow-slate-200">
                                            <FaEye /> Verify Doc
                                        </button>
                                    ) : (
                                        <span className="text-slate-400 font-bold italic text-xs">Processed</span>
                                    )}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <dialog id="details_modal" className="modal backdrop-blur-md">
                <div className="modal-box w-11/12 max-w-7xl h-[90vh] bg-white rounded-[3rem] p-0 overflow-hidden border border-slate-100 flex flex-col shadow-2xl relative">
                    
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                <FaFilePrescription className="text-emerald-500" /> Verify & Prescribe
                            </h3>
                            <p className="text-xs text-slate-600 font-bold uppercase mt-1">Patient: {selectedPrescription?.userEmail}</p>
                        </div>
                        <form method="dialog">
                            <button className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all text-slate-500">
                                <FaTimes />
                            </button>
                        </form>
                    </div>
                    
                    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
                        {/* Left: Image View */}
                        <div className="flex-1 bg-slate-900 relative group overflow-hidden">
                            <img 
                                src={selectedPrescription?.image} 
                                alt="Prescription" 
                                className="w-full h-full object-contain p-4 transition-transform duration-700 hover:scale-110"
                            />
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-[10px] text-white font-bold uppercase tracking-widest border border-white/20">
                                Hover to Zoom
                            </div>
                        </div>

                        {/* Right: Add Medicine Panel */}
                        <div className="w-full lg:w-[450px] flex flex-col bg-white border-l border-slate-100 relative">
                            <div className="flex-1 overflow-y-auto p-8 pb-32">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Add Medications</label>
                                
                                <form onSubmit={handleSearchMedicine} className="flex gap-2 mb-6">
                                    <div className="relative flex-1">
                                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input 
                                            type="text" 
                                            placeholder="Brand or Generic..." 
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-900 text-sm"
                                            value={searchMedicine}
                                            onChange={(e) => setSearchMedicine(e.target.value)}
                                        />
                                    </div>
                                    <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-100">
                                        Search
                                    </button>
                                </form>

                                <div className="space-y-2 mb-8">
                                    <AnimatePresence>
                                        {foundMedicines.map(med => (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                                key={med._id} 
                                                className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-emerald-300 transition-all cursor-pointer group"
                                                onClick={() => handleAddMedicine(med)}
                                            >
                                                <div>
                                                    <p className="font-black text-slate-900 text-sm">{med.itemName}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase">{med.category}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-black text-emerald-600 text-sm">৳{med.price}</span>
                                                    <div className="w-8 h-8 bg-white text-emerald-500 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all"><FaPlus size={10}/></div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                <div className="border border-emerald-100 rounded-[2rem] bg-emerald-50/20 p-6 flex flex-col shadow-inner min-h-[180px]">
                                    <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center justify-between border-b border-emerald-100 pb-2">
                                        Selected Basket <span>{addedMedicines.length} ITEMS</span>
                                    </h4>
                                    <div className="space-y-3">
                                        {addedMedicines.map((med) => (
                                            <div key={med._id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-emerald-100 shadow-sm animate-in fade-in slide-in-from-right-2">
                                                <div>
                                                    <p className="font-black text-slate-900 text-xs">{med.itemName}</p>
                                                    <p className="text-[9px] text-emerald-600 font-bold">৳{med.price} UNIT</p>
                                                </div>
                                                <button onClick={(e) => {e.stopPropagation(); handleRemoveMedicine(med._id)}} className="text-slate-400 hover:text-rose-500 transition-colors p-2">
                                                    <FaTrashAlt size={12}/>
                                                </button>
                                            </div>
                                        ))}
                                        {addedMedicines.length === 0 && (
                                            <p className="text-center text-slate-300 text-[10px] font-black mt-10 uppercase tracking-widest">Basket is Empty</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* STICKY BOTTOM ACTION */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white via-white to-transparent pt-10 border-t border-slate-50">
                                <button 
                                    onClick={handleConfirmOrder} 
                                    className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-2xl shadow-emerald-200 transform active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <FaCheckCircle className="text-lg" /> Authorize & Release
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default ManagePrescriptions;