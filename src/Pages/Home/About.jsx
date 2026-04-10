import React from "react";
import { motion } from "framer-motion";
import { MdVerified, MdOutlineApi, MdSecurity, MdGroups, MdSupportAgent, MdAnalytics, MdSettingsInputComposite } from "react-icons/md";

const AboutSection = () => {
  // Bento Grid Items (Visualizing features instead of listing them)
  const bentoItems = [
    { 
      icon: <MdOutlineApi />, 
      title: "API-Integrated System", 
      desc: "Real-time medicine synchronization with licensed vendor APIs.",
      col: "col-span-12 md:col-span-6"
    },
    { 
      icon: <MdSecurity />, 
      title: "Encrypted Data", 
      desc: "Secure HIPAA-compliant storage for prescriptions and customer data.",
      col: "col-span-12 md:col-span-6"
    },
    { 
      icon: <MdSettingsInputComposite />, 
      title: "Modular Interface", 
      desc: "Clean dashboard design for Admin, Seller, and Customer roles.",
      col: "col-span-12 md:col-span-12" // Spans full width for emphasis
    }
  ];

  const stats = [
    { label: "Active Users", value: "1M+" },
    { label: "Customer Support", value: "24/7" },
    { label: "Reliability", value: "100%" },
  ];

  return (
    <section className="relative bg-white py-12 px-6 overflow-hidden">
      {/* Background Decor (Minimal Accent) */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-50 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* --- LEFT: Bento Grid Visuals (No Images) --- */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-12 gap-4 lg:gap-6"
          >
            {bentoItems.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className={`${item.col} p-8 rounded-3xl bg-slate-50 border border-slate-100 shadow-inner space-y-4`}
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 text-2xl shadow-md border border-slate-100">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-800">{item.title}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* --- RIGHT: Text Content --- */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 w-fit">
              <MdVerified size={16} /> Trusted multi-vendor system
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-8">
              Bangladesh's Premier <span className="text-emerald-500 font-black">Online Pharmacy</span> Infrastructure.
            </h2>

            <p className="text-slate-500 text-lg leading-relaxed mb-10 font-medium">
              PharmaHub is not just a storefront; it is a modern infrastructure connecting customers, verified 
              sellers, and licensed administrators in one secure platform. Built on standard architecture, we simplify 
              online medicine access for Bangladesh's 180 million people, ensuring accuracy and trust through engineering excellence.
            </p>

            {/* Features (Now a compact list with strong iconography) */}
            <div className="flex flex-wrap gap-x-10 gap-y-4 mb-10 border-t border-slate-100 pt-8 grayscale">
              {[
                {icon: <MdGroups />, text: "Role-Based Access (RBAC)" },
                {icon: <MdGroups />, text: "Scalable Infrastructure" },
                {icon: <MdGroups />, text: "API-driven Design" },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-500">
                  <span className="text-lg">{f.icon}</span>
                  <span className="text-xs font-bold uppercase tracking-widest">{f.text}</span>
                </div>
              ))}
            </div>

            {/* Bento Stats (Moved to the end of text flow) */}
            <div className="bg-white border-2 border-slate-50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-emerald-100/50">
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center border-r border-slate-100 last:border-0 pb-4 last:pb-0">
                    <h4 className="text-3xl font-black text-emerald-600">{stat.value}</h4>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;