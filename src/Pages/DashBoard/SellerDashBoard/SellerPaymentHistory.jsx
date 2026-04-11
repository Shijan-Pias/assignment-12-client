import { useQuery } from "@tanstack/react-query";
import UseAuth from "../../../hook/UseAuth";
import UseAxiosSecure from "../../../hook/UseAxiosSecure";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  User, 
  Calendar, 
  CheckCircle2, 
  Hash, 
  ArrowUpRight,
  SearchX
} from "lucide-react";

const SellerPaymentHistory = () => {
  const axiosSecure = UseAxiosSecure();
  const { user } = UseAuth();

  const { data: payments = [], isLoading, error } = useQuery({
    queryKey: ["sellerPayments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments/seller/${user.email}`);
      return res.data.data;
    },
    enabled: !!user?.email,
  });

  const totalRevenue = payments.reduce((acc, curr) => acc + parseFloat(curr.priceTk || 0), 0);

  if (isLoading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium animate-pulse">Analyzing Financial Records...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER & STATS --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              Sales History
            </h2>
            <p className="text-slate-500 text-sm mt-1">Track your earnings and customer transactions.</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-[2rem] shadow-xl shadow-emerald-900/5 border border-slate-100 flex items-center gap-6"
          >
            <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <DollarSign size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Revenue</p>
              <h3 className="text-3xl font-black text-slate-900 leading-none">{totalRevenue.toFixed(2)}৳</h3>
            </div>
            <div className="ml-4 p-2 bg-emerald-50 rounded-full text-emerald-600">
              <ArrowUpRight size={20} />
            </div>
          </motion.div>
        </header>

        {/* --- TABLE SECTION --- */}
        {payments.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm">
            <SearchX size={50} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-xl font-bold text-slate-800">No Sales Record</h3>
            <p className="text-slate-500">Your transaction history will appear here once customers start buying.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Buyer Details</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Amount</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Transaction Info</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {payments.map((p, index) => (
                    <motion.tr 
                      key={p._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                            <User size={18} />
                          </div>
                          <span className="font-bold text-slate-700">{p.finalEmail}</span>
                        </div>
                      </td>
                      
                      <td className="px-8 py-6 text-center">
                        <span className="font-black text-slate-900 text-lg">{p.priceTk}৳</span>
                      </td>

                      <td className="px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-2 text-slate-400 font-mono text-xs">
                          <Hash size={14} />
                          <span>{p.transactionId.slice(-12).toUpperCase()}</span>
                        </div>
                      </td>

                      <td className="px-8 py-6 text-center">
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-tighter border border-emerald-100">
                          <CheckCircle2 size={12} /> {p.status}
                        </span>
                      </td>

                      <td className="px-8 py-6 text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-slate-700 text-sm">
                            {new Date(p.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerPaymentHistory;