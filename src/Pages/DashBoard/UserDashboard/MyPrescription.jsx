import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import UseAxiosSecure from '../../../hook/UseAxiosSecure';
import UseAuth from '../../../hook/UseAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaFilePrescription, 
  FaClock, 
  FaCheckCircle, 
  FaCreditCard, 
  FaPills, 
  FaChevronRight,
  FaCalendarAlt
} from 'react-icons/fa';

const MyPrescriptions = () => {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();

    const { data: prescriptions = [], isLoading } = useQuery({
        queryKey: ['my-prescriptions', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/prescriptions/user/${user.email}`);
            return res.data;
        }
    });

    if (isLoading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <span className="loading loading-ring loading-lg text-emerald-500"></span>
        </div>
    );

    return (
        <div className="w-full py-10 px-4 md:px-10 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
            {/* --- HEADER --- */}
            <div className="mb-10 max-w-5xl">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <FaFilePrescription className="text-emerald-500" /> My Prescriptions
                </h2>
                <p className="text-slate-500 mt-2 font-medium text-lg italic">
                    Managing your health documents and active medication orders.
                </p>
            </div>

            {/* --- PRESCRIPTION LIST --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AnimatePresence>
                    {prescriptions.map((pres, index) => {
                        const total = pres.medicines?.reduce((t, m) => t + m.price, 0) || 0;
                        
                        return (
                            <motion.div 
                                key={pres._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col"
                            >
                                {/* Card Header */}
                                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-white rounded-2xl shadow-sm text-emerald-500 border border-slate-100">
                                            <FaCalendarAlt size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitted Date</p>
                                            <h3 className="font-bold text-slate-800 uppercase tracking-tighter">
                                                {new Date(pres.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </h3>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                        pres.status === 'confirmed' 
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                            : 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                                    }`}>
                                        {pres.status === 'confirmed' ? <FaCheckCircle /> : <FaClock />}
                                        {pres.status}
                                    </span>
                                </div>

                                <div className="p-8 flex flex-col md:flex-row gap-8 flex-1">
                                    {/* Left: Doc Image */}
                                    <div className="w-32 h-32 md:w-40 md:h-40 relative group shrink-0">
                                        <img 
                                            src={pres.image} 
                                            alt="Rx" 
                                            className="w-full h-full object-cover rounded-3xl border-4 border-white shadow-lg group-hover:brightness-50 transition-all duration-300" 
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <span className="text-[10px] text-white font-black uppercase tracking-widest bg-emerald-500/80 px-3 py-1 rounded-full">View Full</span>
                                        </div>
                                    </div>

                                    {/* Right: Order Details */}
                                    <div className="flex-1 space-y-4">
                                        {pres.status === 'confirmed' ? (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                                <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
                                                    <FaPills /> Prescribed Medications
                                                </div>
                                                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                                                    {pres.medicines.map((m, idx) => (
                                                        <div key={idx} className="flex justify-between items-center text-sm">
                                                            <span className="font-bold text-slate-700 leading-none">{m.itemName}</span>
                                                            <span className="font-mono font-bold text-slate-400 leading-none">৳{m.price}</span>
                                                        </div>
                                                    ))}
                                                    <div className="h-px bg-slate-200 my-2" />
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-slate-400 font-bold uppercase text-[10px]">Grand Total</span>
                                                        <span className="text-2xl font-black text-slate-900 tracking-tighter">৳{total}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-full flex flex-col justify-center py-4">
                                                <p className="text-slate-400 font-bold italic leading-relaxed text-sm">
                                                    Our pharmacy experts are currently reviewing your document. You will be notified once medications are added.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer Action */}
                                <div className="p-6 bg-slate-50/50 border-t border-slate-50 mt-auto">
                                    {pres.status === 'confirmed' ? (
                                        <Link 
                                            to={`/dashboard/payment/${pres._id}`} 
                                            state={{ totalAmount: total }}
                                            className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-slate-200 transform active:scale-95 flex items-center justify-center gap-3"
                                        >
                                            <FaCreditCard /> Proceed to Checkout <FaChevronRight size={10} />
                                        </Link>
                                    ) : (
                                        <button className="w-full bg-slate-200 text-slate-400 py-4 rounded-2xl font-black uppercase tracking-widest text-xs cursor-not-allowed flex items-center justify-center gap-3">
                                            Verification in Progress...
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {prescriptions.length === 0 && (
                    <div className="col-span-full py-32 text-center flex flex-col items-center gap-4 bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <FaFilePrescription size={64} className="text-slate-200" />
                        <h3 className="text-2xl font-black text-slate-400 uppercase tracking-widest">No Prescriptions Found</h3>
                        <Link to="/shop" className="btn btn-emerald-500 rounded-2xl px-10">Upload Your First Rx</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPrescriptions;