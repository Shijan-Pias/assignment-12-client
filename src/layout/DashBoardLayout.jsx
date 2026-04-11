import React from 'react';
import { NavLink, Outlet } from 'react-router';
import UseUserRole from '../hook/UseUserRole';
import UseAuth from '../hook/UseAuth';
import { 
  LayoutDashboard, 
  Home, 
  CreditCard, 
  FileText, 
  PlusCircle, 
  Settings, 
  Package, 
  History, 
  Users, 
  BarChart3,
  Menu,
  ShieldCheck,
  LogOut,
  Pill
} from 'lucide-react';
import { motion } from 'framer-motion';

const DashBoardLayout = () => {
    const { role, roleLoading } = UseUserRole();
    const { user, logoutUser } = UseAuth();
    console.log(logoutUser);
    console.log(user);

    const activeClass = "flex items-center gap-3 bg-emerald-500 text-white px-4 py-3 rounded-2xl shadow-lg shadow-emerald-200 transition-all duration-300 font-bold";
    const inactiveClass = "flex items-center gap-3 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-3 rounded-2xl transition-all duration-200 font-semibold";

    const SidebarLink = ({ to, icon: Icon, children }) => (
        <li className="mb-2">
            <NavLink to={to} className={({ isActive }) => isActive ? activeClass : inactiveClass}>
                <Icon size={20} />
                <span>{children}</span>
            </NavLink>
        </li>
    );

    return (
        <div className="drawer lg:drawer-open bg-[#F8FAFC]">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            
            <div className="drawer-content flex flex-col">
                {/* --- MOBILE NAVBAR --- */}
                <header className="flex lg:hidden items-center justify-between p-4 bg-white border-b border-slate-100 sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-md">
                            <Pill size={20} />
                        </div>
                        <span className="font-black text-slate-800 tracking-tight">PharmaHub</span>
                    </div>
                    <label htmlFor="my-drawer-2" className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer">
                        <Menu size={24} />
                    </label>
                </header>

                {/* --- MAIN VIEWPORT --- */}
                <main className="p-4 md:p-8 lg:p-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>

            {/* --- SIDEBAR --- */}
            <div className="drawer-side z-40">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="min-h-full w-80 bg-white border-r border-slate-100 flex flex-col p-6 shadow-sm">
                    
                    {/* Brand Logo */}
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <div className="bg-emerald-500 w-10 h-10 flex items-center justify-center rounded-2xl text-white shadow-lg shadow-emerald-200">
                            <Pill size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">PharmaHub</h1>
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mt-1 inline-block">Management Suite</span>
                        </div>
                    </div>

                    {/* Navigation Groups */}
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <ul className="menu p-0">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-4">Navigation</p>
                            <SidebarLink to="/" icon={Home}>Portal Home</SidebarLink>
                            
                            {/* --- USER ROUTES --- */}
                            {role === 'user' && (
                                <>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest my-4 px-4">Patient Area</p>
                                    <SidebarLink to="/dashBoard/paymentHistory" icon={CreditCard}>My Billing</SidebarLink>
                                    <SidebarLink to="/dashBoard/myPrescription" icon={FileText}>Health Records</SidebarLink>
                                </>
                            )}

                            {/* --- SELLER ROUTES --- */}
                            {role === 'seller' && (
                                <>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest my-4 px-4">Storefront Management</p>
                                    <SidebarLink to="/dashBoard/addMedicine" icon={PlusCircle}>List New Item</SidebarLink>
                                    <SidebarLink to="/dashBoard/manageMedicine" icon={Package}>Live Inventory</SidebarLink>
                                    <SidebarLink to="/dashBoard/sellerPaymentHistory" icon={History}>Revenue Logs</SidebarLink>
                                </>
                            )}

                            {/* --- ADMIN ROUTES --- */}
                            {!roleLoading && role === 'admin' && (
                                <>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest my-4 px-4">Super Admin Console</p>
                                    <SidebarLink to="/dashboard/managePrescription" icon={ShieldCheck}>Audit Center</SidebarLink>
                                    <SidebarLink to="/dashboard/makeAdmin" icon={Users}>Access Control</SidebarLink>
                                    <SidebarLink to="/dashboard/manageCategory" icon={LayoutDashboard}>Categories</SidebarLink>
                                    <SidebarLink to="/dashboard/adminPayment" icon={BarChart3}>Financial Audit</SidebarLink>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* --- PROFILE FOOTER --- */}
                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-[1.5rem]">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-black border-2 border-white shadow-sm overflow-hidden">
                                {user?.photoURL ? <img src={user.photoURL} className='w-full h-full object-cover' /> : user?.displayName?.charAt(0)}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold text-slate-800 truncate leading-none mb-1">{user?.displayName}</p>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter truncate">{role}</p>
                            </div>
                            <button onClick={logoutUser} title='Logout' className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DashBoardLayout;