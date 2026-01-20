import React from 'react';
import { FaFileUpload, FaUserMd, FaTruck, FaArrowRight } from 'react-icons/fa';

const HowItWorks = () => {
    const steps = [
        {
            id: 1,
            title: "Upload Prescription",
            description: "Just take a clear photo of your prescription and upload it directly to our secure portal.",
            icon: <FaFileUpload />,
            color: "bg-blue-100 text-blue-600"
        },
        {
            id: 2,
            title: "Verification",
            description: "Our certified pharmacists will verify your prescription and add the medicines to your cart.",
            icon: <FaUserMd />,
            color: "bg-emerald-100 text-emerald-600"
        },
        {
            id: 3,
            title: "Doorstep Delivery",
            description: "Relax! We will pack your medicines with care and deliver them to your home fast.",
            icon: <FaTruck />,
            color: "bg-orange-100 text-orange-600"
        }
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                        How It Works?
                    </h2>
                    <p className="text-slate-500 mt-2">
                        Get your medicines in 3 simple steps
                    </p>
                </div>

                {/* Steps Container */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative">
                    
                    {/* Decorative Line (Desktop Only) */}
                    <div className="hidden md:block absolute top-12 left-20 right-20 h-1 border-t-2 border-dashed border-slate-200 -z-0"></div>

                    {steps.map((step, index) => (
                        <div key={step.id} className="flex-1 w-full relative z-10">
                            <div className="flex flex-col items-center text-center group">
                                
                                {/* Icon Circle */}
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 ${step.color}`}>
                                    {step.icon}
                                </div>

                                {/* Step Number Badge */}
                                <div className="absolute top-0 right-1/2 translate-x-10 bg-slate-800 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold border-4 border-white">
                                    {step.id}
                                </div>

                                {/* Text Content */}
                                <h3 className="text-xl font-bold text-slate-700 mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
};

export default HowItWorks;