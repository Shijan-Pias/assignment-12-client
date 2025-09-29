import React from 'react';
import Marquee from "react-fast-marquee";

// Sample brand logos - replace these with your actual vendor/brand logo URLs
const brandLogos = [
    { name: 'Brand 1', url: 'https://i.ibb.co.com/TDjpJPyJ/download-4.jpg' },
    { name: 'Brand 2', url: 'https://i.ibb.co.com/bg6NR1Rg/images-2.png' },
    { name: 'Brand 3', url: 'https://i.ibb.co.com/KQ9kXYn/images-3.png' },
    { name: 'Brand 4', url: 'https://cdn.worldvectorlogo.com/logos/novartis.svg' },
    { name: 'Brand 5', url: 'https://cdn.worldvectorlogo.com/logos/merck-1.svg' },
    { name: 'Brand 6', url: 'https://i.ibb.co.com/HskGCM2/images-4.jpg' },
    { name: 'Brand 7', url: 'https://i.ibb.co.com/bg6NR1Rg/images-2.png' },
    { name: 'Brand 8', url: 'https://i.ibb.co.com/HskGCM2/images-4.jpg' }
];


const BrandsMarquee = () => {
    return (
        <div className="py-12 md:py-16 bg-base-100">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-2">Our Trusted Brands</h2>
                <p className="text-center text-gray-500 mb-12">We partner with the world's leading pharmaceutical brands.</p>

                <Marquee
                    pauseOnHover={true}
                    speed={60}
                    gradient={true}
                    gradientColor={[255, 255, 255]} // Match this with your background color (bg-base-100 is typically white)
                >
                    {brandLogos.map((brand, index) => (
                        <div key={index} className="mx-8 md:mx-12">
                            <img
                                src={brand.url}
                                alt={brand.name}
                                className="h-10 md:h-12 object-contain filter grayscale hover:grayscale-0 transition-all duration-300 ease-in-out"
                            />
                        </div>
                    ))}
                </Marquee>
            </div>
        </div>
    );
};

export default BrandsMarquee;