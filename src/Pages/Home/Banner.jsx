import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const Banner = () => {
    return (
        <Carousel
            showArrows={true}
            autoPlay={true}
            infiniteLoop={true}
            showThumbs={false}
            showStatus={false}
            className="text-center"
        >
            {/* Slide 1 - Blue Tint */}
            <div className="relative h-[600px]">
                <img src="https://images.unsplash.com/photo-1576091160550-2173dba9996a?q=80&w=2070" alt="Doctor and patient" className="object-cover h-full w-full" />
                {/* MODIFIED LINE: Changed bg-black to bg-blue-900 and opacity to 50 */}
                <div className="absolute inset-0 bg-blue-900 bg-opacity-50 flex items-center justify-center">
                    <div className="text-white p-4 md:p-8 rounded-lg max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Your Trusted Health Partner</h2>
                        <p className="text-lg md:text-xl mb-6">Providing certified medicines from trusted vendors, right at your doorstep.</p>
                        
                    </div>
                </div>
            </div>

            {/* Slide 2 - Green Tint */}
            <div className="relative h-[600px]">
                <img src="https://images.unsplash.com/photo-1584308666744-8480404b63e0?q=80&w=1974" alt="Pharmacy" className="object-cover h-full w-full" />
                {/* MODIFIED LINE: Changed bg-black to bg-green-800 and opacity to 50 */}
                <div className="absolute inset-0 bg-green-800 bg-opacity-50 flex items-center justify-center">
                    <div className="text-white p-4 md:p-8 rounded-lg max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">A Wide Range of Healthcare Products</h2>
                        <p className="text-lg md:text-xl mb-6">From prescription medicines to wellness products, we have everything you need.</p>
                        
                    </div>
                </div>
            </div>

            {/* Slide 3 - Teal Tint */}
            <div className="relative h-[600px]">
                <img src="https://images.unsplash.com/photo-1618939304343-418a73228022?q=80&w=2070" alt="Home delivery" className="object-cover h-full w-full" />
                {/* MODIFIED LINE: Changed bg-black to bg-teal-700 and opacity to 50 */}
                <div className="absolute inset-0 bg-teal-700 bg-opacity-50 flex items-center justify-center">
                    <div className="text-white p-4 md:p-8 rounded-lg max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Fast, Safe, and Convenient</h2>
                        <p className="text-lg md:text-xl mb-6">Get your healthcare essentials delivered safely to your home with our express delivery service.</p>
                        
                    </div>
                </div>
            </div>
        </Carousel>
    );
};

export default Banner;