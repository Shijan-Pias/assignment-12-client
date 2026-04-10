import React from 'react';
import { motion } from 'framer-motion';
import { MdOutlineFileUpload, MdOutlineVerifiedUser, MdOutlineDeliveryDining } from 'react-icons/md';
import { Link } from 'react-router';

const HowItWorks = () => {
    const steps = [
        {
            id: "01",
            title: "Upload Prescription",
            desc: "Securely upload a photo of your doctor's note to our HIPAA-compliant portal.",
            icon: <MdOutlineFileUpload />,
            gradient: "from-blue-500 to-cyan-400",
            shadow: "shadow-blue-200"
        },
        {
            id: "02",
            title: "Expert Verification",
            desc: "Our licensed pharmacists verify the dosage and authenticity within minutes.",
            icon: <MdOutlineVerifiedUser />,
            gradient: "from-emerald-500 to-teal-400",
            shadow: "shadow-emerald-200"
        },
        {
            id: "03",
            title: "Doorstep Delivery",
            desc: "Receive your medication in temperature-controlled packaging right at your door.",
            icon: <MdOutlineDeliveryDining />,
            gradient: "from-orange-500 to-amber-400",
            shadow: "shadow-orange-200"
        }
    ];

    return (
        <section className="py-14 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header Section */}
                <div className="text-center mb-20">
                    <motion.span 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-emerald-600 font-black text-xs uppercase tracking-[0.3em]"
                    >
                        Easy Process
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black text-slate-900 mt-4"
                    >
                        How It <span className="text-emerald-500">Works?</span>
                    </motion.h2>
                    <p className="text-slate-400 mt-4 text-lg max-w-lg mx-auto font-medium">
                        Your health journey simplified into three seamless steps.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
                    
                    {/* The Background Connecting Path (Desktop) */}
                    <svg className="hidden md:block absolute top-24 left-0 w-full h-20 z-0 pointer-events-none" viewBox="0 0 1000 100" fill="none">
                        <motion.path 
                            d="M100,50 Q300,0 500,50 T900,50" 
                            stroke="#E2E8F0" 
                            strokeWidth="3" 
                            strokeDasharray="12 12" 
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        />
                    </svg>

                    {steps.map((step, index) => (
                        <motion.div 
                            key={step.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="relative z-10 group"
                        >
                            {/* Card Container */}
                            <div className="flex flex-col items-center text-center">
                                
                                {/* Animated Icon Core */}
                                <div className="relative mb-10">
                                    <motion.div 
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className={`w-28 h-28 rounded-[2.5rem] bg-gradient-to-br ${step.gradient} ${step.shadow} shadow-2xl flex items-center justify-center text-white text-4xl relative z-10 transition-all`}
                                    >
                                        {step.icon}
                                    </motion.div>
                                    
                                    {/* Step Number Bubble */}
                                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center font-black text-slate-800 text-sm z-20">
                                        {step.id}
                                    </div>

                                    {/* Decorative Pulse Effect */}
                                    <div className={`absolute inset-0 rounded-[2.5rem] bg-gradient-to-br ${step.gradient} opacity-20 blur-xl group-hover:scale-150 transition-transform duration-500`} />
                                </div>

                                {/* Typography */}
                                <h3 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-emerald-600 transition-colors">
                                    {step.title}
                                </h3>
                                <p className="text-slate-500 font-medium leading-relaxed px-4">
                                    {step.desc}
                                </p>

                                {/* Action Indicator (Small Arrow) */}
                                <motion.div 
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="mt-6 text-slate-300 hidden md:block"
                                >
                                    {index < 2 && <MdOutlineFileUpload className="rotate-90 opacity-40" size={24} />}
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA to tie it together */}
                <Link to='/shopPage'>
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-20 text-center"
                >
                    <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-emerald-600 hover:shadow-2xl hover:shadow-emerald-200 transition-all active:scale-95">
                        Start Your Order Now
                    </button>
                </motion.div>
                </Link>
            </div>
        </section>
    );
};

export default HowItWorks;