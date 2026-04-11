import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../hook/UseAxiosSecure";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ShieldCheck, 
  UserCog, 
  Store, 
  User as UserIcon, 
  Mail, 
  Clock, 
  Users,
  ChevronRight,
  Hash
} from "lucide-react";

const MakeAdmin = () => {
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();
  const [searchEmail, setSearchEmail] = useState("");

  const { data: users = [], isFetching } = useQuery({
    queryKey: ["users", searchEmail],
    queryFn: async () => {
      const url = `/users/search${searchEmail ? `?email=${searchEmail}` : ""}`;
      const res = await axiosSecure.get(url);
      return res.data;
    },
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }) => axiosSecure.patch(`/users/${userId}/role`, { role }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users", searchEmail] });
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: 'success',
        title: `Permission Updated: ${variables.role.toUpperCase()}`
      });
    },
  });

  const handleChangeRole = (userId, newRole) => {
    Swal.fire({
      title: "Change Permissions?",
      text: `User will be granted "${newRole}" access level.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Confirm Change",
      customClass: { popup: 'rounded-[2rem]' }
    }).then((result) => {
      if (result.isConfirmed) {
        roleMutation.mutate({ userId, role: newRole });
      }
    });
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case 'admin': return "bg-indigo-50 text-indigo-600 border-indigo-100";
      case 'seller': return "bg-emerald-50 text-emerald-600 border-emerald-100";
      default: return "bg-blue-50 text-blue-600 border-blue-100";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <ShieldCheck size={12} />;
      case 'seller': return <Store size={12} />;
      default: return <UserIcon size={12} />;
    }
  };

  return (
    <div className="p-4 md:p-10 bg-[#F8FAFC] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <UserCog className="text-indigo-600" size={32} /> Identity & Access
            </h2>
            <p className="text-slate-500 text-sm mt-1 uppercase font-bold tracking-[0.2em]">User Authority Management</p>
          </div>

          <div className="bg-white p-4 px-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Users size={20}/></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Members</p>
              <p className="text-xl font-black text-slate-900">{users.length}</p>
            </div>
          </div>
        </header>

        {/* --- SEARCH BAR --- */}
        <div className="relative mb-8 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search accounts by email address..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] shadow-xl shadow-slate-200/50 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-600 font-medium"
          />
          {isFetching && (
            <div className="absolute right-5 top-1/2 -translate-y-1/2">
               <span className="loading loading-spinner loading-sm text-indigo-600"></span>
            </div>
          )}
        </div>

        {/* --- DATA TABLE --- */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Member Profile</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Current Role</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Membership Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Promote / Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                <AnimatePresence mode="popLayout">
                  {users.map((u, idx) => (
                    <motion.tr 
                      key={u._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white border border-transparent group-hover:border-slate-100 transition-all">
                              <UserIcon size={20}/>
                           </div>
                           <div className="space-y-1">
                             <div className="flex items-center gap-2 font-bold text-slate-800">
                               <Mail size={12} className="text-slate-400" /> {u.email}
                             </div>
                             <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                                <Hash size={10}/> {u._id.slice(-10)}
                             </div>
                           </div>
                        </div>
                      </td>

                      <td className="px-8 py-6 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getRoleStyle(u.role)}`}>
                          {getRoleIcon(u.role)} {u.role}
                        </span>
                      </td>

                      <td className="px-8 py-6 text-center">
                        <div className="flex flex-col items-center gap-1 text-slate-500">
                          <span className="font-bold flex items-center gap-1"><Clock size={12}/> {new Date(u.created_at).toLocaleDateString('en-GB')}</span>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-2">
                           {["user", "seller", "admin"].map((r) => (
                              r !== u.role && (
                                <button
                                  key={r}
                                  onClick={() => handleChangeRole(u._id, r)}
                                  className="px-4 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white text-[10px] font-black uppercase tracking-tighter rounded-lg transition-all shadow-lg shadow-slate-200 transform active:scale-95 flex items-center gap-1 group/btn"
                                >
                                  Make {r} <ChevronRight size={10} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                              )
                           ))}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {users.length === 0 && !isFetching && (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="p-6 bg-slate-50 rounded-full mb-4">
                <Search size={48} className="text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No matching accounts</h3>
              <p className="text-slate-500 mt-1">Try a different email or check for spelling errors.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MakeAdmin;