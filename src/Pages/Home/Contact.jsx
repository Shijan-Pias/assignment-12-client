import React from 'react';
import { motion } from "framer-motion";
import { 
  MdLocalShipping, MdHealthAndSafety, MdMedicalServices, 
  MdHistory, MdPercent, MdSupportAgent, MdScience, MdFactCheck 
} from "react-icons/md";

const BenefitsAndServices = () => {
  const benefits = [
    { icon: <MdLocalShipping />, title: "Fast Delivery", desc: "Reliable doorstep delivery in 30 mins." },
    { icon: <MdHealthAndSafety />, title: "Quality Assured", desc: "All medications meet global safety standards." },
    { icon: <MdMedicalServices />, title: "Easy Refills", desc: "Hassle-free automated prescription refills." },
    { icon: <MdPercent />, title: "Affordable Price", desc: "Exclusive discounts on generic & brand drugs." },
  ];

  const services = [
    { 
      title: "Medicine Delivery", 
      desc: "Order online and get authentic medicines delivered with temperature-controlled packaging.",
      icon: <MdLocalShipping className="text-blue-500" />
    },
    { 
      title: "Doctor Consultation", 
      desc: "Connect with qualified medical professionals from home without visiting a clinic.",
      icon: <MdMedicalServices className="text-emerald-500" />
    },
    { 
      title: "Lab Tests at Home", 
      desc: "Order diagnostic tests online and get accurate results delivered to your app within days.",
      icon: <MdScience className="text-purple-500" />
    },
    { 
      title: "Digital Health Records", 
      desc: "Keep track of your medical history, prescriptions, and lab results in one secure place.",
      icon: <MdHistory className="text-orange-500" />
    }
  ];

  return (
    <section className="py-14 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- PART 1: Benefits Grid --- */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-6"
          >
            Why Choose <span className="text-emerald-500">PharmaHub?</span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-emerald-100/50 transition-all group"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-500 text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h4 className="text-xl font-black text-slate-800 mb-2">{benefit.title}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- PART 2: Services Detailed (Alternating Layout) --- */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Our Core Services</h3>
            <p className="text-slate-400 mt-2 font-bold">Comprehensive healthcare solutions at your fingertips.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <motion.div 
                key={i}
                whileHover={{ x: 10 }}
                className="flex items-start gap-6 p-8 bg-white border-2 border-slate-50 rounded-[2rem] hover:border-emerald-100 hover:shadow-lg transition-all"
              >
                <div className="text-4xl p-4 bg-slate-50 rounded-2xl">
                  {service.icon}
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-800 mb-3">{service.title}</h4>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    {service.desc}
                  </p>
                  <button className="mt-4 text-emerald-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                    Learn More <MdFactCheck />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- PART 3: Trust Bar --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 p-10 bg-slate-900 rounded-[3rem] text-center text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-around gap-8">
            <div className="flex items-center gap-4">
              <MdSupportAgent size={40} className="text-emerald-400" />
              <div className="text-left">
                <h5 className="font-black text-xl leading-none">24/7 Support</h5>
                <p className="text-slate-400 text-xs mt-1">Ready to help anytime.</p>
              </div>
            </div>
            <div className="h-10 w-[1px] bg-slate-700 hidden md:block" />
            <div className="text-center">
              <h5 className="text-3xl font-black text-emerald-400">100% Secure</h5>
              <p className="text-slate-400 text-xs mt-1 italic font-medium">Verified Medical Standards</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default BenefitsAndServices;