import React from 'react';
import { useQuery } from "@tanstack/react-query";
import UseAuth from "../../hook/UseAuth";
import UseAxiosSecure from "../../hook/UseAxiosSecure";
import { 
  FaHistory, 
  FaHashtag, 
  FaDownload, 
  FaWallet, 
  FaShieldAlt, 
  FaSearchDollar 
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router"; // Added this to prevent crash

const PaymentHistory = () => {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();

    const { isLoading, data: payments = [] } = useQuery({
        queryKey: ['payments', user?.email],
        queryFn: async () => {
            if (!user?.email) return [];
            const res = await axiosSecure.get(`/payments?email=${user.email}`);
            // Check if data exists and is an array, otherwise return empty array
            return Array.isArray(res.data.data) ? res.data.data : [];
        },
        enabled: !!user?.email // Only run query if email exists
    });

    // ✅ FIXED CALCULATION LOGIC (Added safety check)
    const totalSpent = Array.isArray(payments) 
        ? payments.reduce((acc, curr) => acc + parseFloat(curr.priceTk || 0), 0) 
        : 0;

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto mt-10 p-6 space-y-6">
                <div className="h-20 bg-slate-200 animate-pulse rounded-3xl"></div>
                <div className="h-[400px] bg-slate-100 animate-pulse rounded-[2.5rem]"></div>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                            <FaShieldAlt size={20} />
                        </div>
                        <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest">Secure Ledger</span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Payment History
                    </h2>
                    <p className="text-slate-500 mt-2 font-medium">Verified transaction records for {user?.displayName}</p>
                </div>

                <div className="flex gap-4 w-full lg:w-auto">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex-1 lg:min-w-[240px]"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Investment</span>
                            <FaWallet className="text-emerald-500" />
                        </div>
                        <p className="text-3xl font-black text-slate-900 leading-none">৳{totalSpent.toFixed(2)}</p>
                    </motion.div>
                </div>
            </div>
            <div className="bg-white shadow-2xl shadow-slate-200/60 rounded-[2.5rem] border border-slate-100 overflow-hidden">
                {payments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction ID</th>
                                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Amount</th>
                                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Date & Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {payments.map((pay, index) => (
                                    <motion.tr 
                                        key={pay._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-slate-50/80 transition-colors group"
                                    >
                                        <td className="p-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-white transition-colors">
                                                    <FaHashtag size={12}/>
                                                </div>
                                                <span className="font-mono text-sm font-bold text-slate-700 tracking-tighter uppercase">
                                                    {pay.transactionId?.slice(-15)}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="p-8 text-center">
                                            <span className="text-xl font-black text-slate-900 tracking-tight">
                                                ৳{pay.priceTk}
                                            </span>
                                        </td>

                                        <td className="p-8 text-center">
                                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                Verified Paid
                                            </span>
                                        </td>

                                        <td className="p-8 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="font-bold text-slate-800 text-sm">
                                                    {new Date(pay.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase">
                                                    {new Date(pay.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>

                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center px-6">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-slate-200">
                            <FaSearchDollar className="text-4xl text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2 uppercase tracking-widest">No Records Found</h3>
                        <p className="text-slate-500 max-w-xs mx-auto font-medium">Your pharmaceutical purchase history is currently empty.</p>
                        <Link to="/shop" className="mt-8 px-8 py-4 bg-emerald-500 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-600 transition-all active:scale-95">
                            Browse Store
                        </Link>
                    </div>
                )}
            </div>

            {/* --- FOOTER --- */}
            <div className="mt-12 flex flex-col items-center gap-2 pb-10">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Encrypted Pharmaceutical Ledger</p>
                <div className="h-1 w-12 bg-emerald-200 rounded-full" />
            </div>
        </div>
    );
};

export default PaymentHistory;