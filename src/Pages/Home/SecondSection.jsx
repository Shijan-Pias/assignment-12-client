import React from 'react';
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";

const brandLogos = [
    { name: 'Novartis', url: 'https://cdn.worldvectorlogo.com/logos/novartis.svg' },
    { name: 'Merck', url: 'https://cdn.worldvectorlogo.com/logos/merck-1.svg' },
    { name: 'Pfizer', url: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Pfizer_logo.svg' },
    { name: 'Sanofi', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Sanofi_logo.svg' },
    { name: 'Bayer', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Bayer_logo.svg' },
    { name: 'GSK', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/GSK_logo_2022.svg' },
];

const BrandsMarquee = () => {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header Section (White Theme) */}
                <div className="text-center mb-16 relative">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-emerald-600 font-black text-xs uppercase tracking-[0.3em] mb-4"
                    >
                        Strategic Partnerships
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black text-slate-900"
                    >
                        Our Trusted <span className="text-emerald-500 font-black">Brands</span>
                    </motion.h2>
                </div>

                {/* --- The Black Picture Section --- */}
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    className="relative bg-slate-900 rounded-[3.5rem] py-16 shadow-2xl shadow-emerald-900/20 overflow-hidden"
                >
                    {/* Shadow overlays for the Black Background */}
                    <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none" />

                    <Marquee
                        pauseOnHover={true}
                        speed={70}
                        gradient={false}
                    >
                        {brandLogos.map((brand, index) => (
                            <div 
                                key={index} 
                                className="mx-12 md:mx-20 flex items-center justify-center transition-all duration-500 brightness-0 invert opacity-60 hover:opacity-100 hover:scale-110"
                            >
                                <img
                                    src={brand.url}
                                    alt={brand.name}
                                    className="h-10 md:h-14 w-auto object-contain"
                                />
                            </div>
                        ))}
                    </Marquee>
                </motion.div>

                {/* Trust Footer (Flexible/White Theme) */}
                <div className="mt-16 flex flex-wrap justify-center gap-12 border-t border-slate-100 pt-10">
                    {[
                        { label: "DGDA Approved", icon: "✓" },
                        { label: "ISO Certified", icon: "✓" },
                        { label: "WHO Compliant", icon: "✓" }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
                            <span className="text-emerald-500">{item.icon}</span>
                            {item.label}
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default BrandsMarquee;