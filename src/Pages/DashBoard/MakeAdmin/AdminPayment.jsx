import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../hook/UseAxiosSecure";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  Clock, 
  Mail, 
  DollarSign, 
  Hash, 
  ShieldCheck, 
  CreditCard,
  TrendingUp
} from "lucide-react";

const AdminPayments = () => {
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();
  const [loadingId, setLoadingId] = useState(null);

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments");
      return res.data.data;
    },
  });

  const acceptMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/payments/${id}/accept`);
      return res.data;
    },
    onMutate: (id) => setLoadingId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      setLoadingId(null);
    },
    onError: () => setLoadingId(null),
  });

  const handleAccept = (id) => {
    Swal.fire({
      title: "Authorize Payment?",
      text: "Confirming this will mark the transaction as cleared.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      confirmButtonText: "Yes, Authorize",
      customClass: { popup: 'rounded-[1.5rem]' }
    }).then((result) => {
      if (result.isConfirmed) {
        acceptMutation.mutate(id);
      }
    });
  };

  // Calculations for Stats
  const totalRevenue = payments.reduce((acc, p) => acc + (p.status === 'paid' ? parseFloat(p.priceTk) : 0), 0);
  const pendingAmount = payments.reduce((acc, p) => acc + (p.status === 'pending' ? parseFloat(p.priceTk) : 0), 0);

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-slate-50">
      <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-bold tracking-tight">Accessing Secure Ledger...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* --- DASHBOARD HEADER --- */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <ShieldCheck className="text-emerald-500" size={32} /> Payment Control
            </h2>
            <p className="text-slate-500 text-sm mt-1 uppercase font-bold tracking-widest">Financial Audit Logs</p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white p-4 px-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><TrendingUp size={20}/></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Revenue</p>
                <p className="text-xl font-black text-slate-900">{totalRevenue.toFixed(2)}৳</p>
              </div>
            </div>
            <div className="bg-white p-4 px-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock size={20}/></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</p>
                <p className="text-xl font-black text-slate-900">{pendingAmount.toFixed(2)}৳</p>
              </div>
            </div>
          </div>
        </header>

        {/* --- DATA TABLE --- */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entity Details</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Reference</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Amount</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                <AnimatePresence>
                  {payments.map((p, idx) => (
                    <motion.tr 
                      key={p._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 font-bold text-slate-800">
                            <Mail size={14} className="text-slate-400" /> {p.finalEmail}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="font-bold text-emerald-500/70 uppercase tracking-tighter">Seller:</span> {p.sellerEmail}
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6 text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-mono font-bold text-slate-500 uppercase">
                          <Hash size={10} /> {p.medicineId.slice(-8)}
                        </div>
                      </td>

                      <td className="px-8 py-6 text-center">
                        <span className="font-black text-slate-900 text-lg">
                          {p.priceTk}৳
                        </span>
                      </td>

                      <td className="px-8 py-6 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight border ${
                          p.status === "pending" 
                            ? "bg-amber-50 text-amber-600 border-amber-100" 
                            : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        }`}>
                          {p.status === "pending" ? <Clock size={12} /> : <CheckCircle size={12} />}
                          {p.status}
                        </span>
                      </td>

                      <td className="px-8 py-6 text-right">
                        {p.status === "pending" ? (
                          <button
                            disabled={loadingId === p._id}
                            onClick={() => handleAccept(p._id)}
                            className="bg-slate-900 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold transition-all transform active:scale-95 flex items-center gap-2 ml-auto text-xs shadow-lg shadow-slate-200"
                          >
                            {loadingId === p._id ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              <><CreditCard size={14} /> Authorize</>
                            )}
                          </button>
                        ) : (
                          <span className="text-slate-300 font-bold italic text-xs">Settled</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {payments.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="p-6 bg-slate-50 rounded-full mb-4">
                <ShieldCheck size={48} className="text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Clear Ledger</h3>
              <p className="text-slate-500 mt-1">No transaction records found in the database.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;