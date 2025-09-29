import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

// Sample category data - replace with your actual data
const categories = [
    {
        name: 'Vitamins & Supplements',
        icon: ( <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> )
    },
    {
        name: 'Personal Care',
        icon: ( <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> )
    },
    {
        name: 'Baby & Mother Care',
        icon: ( <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.871 4A17.926 17.926 0 003 12c0 2.874.673 5.59 1.871 8M21 12a17.926 17.926 0 00-1.87-8C17.327 6.41 14.874 8 12 8s-5.327-1.59-7.13-4" /></svg> )
    },
    {
        name: 'Medical Devices',
        icon: ( <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg> )
    },
    {
        name: 'Herbal & Ayurvedic',
        icon: ( <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20" /></svg> )
    },
    {
        name: 'Sexual Wellness',
        icon: ( <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> )
    },
    {
        name: 'Prescription',
        icon: ( <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> )
    }
];

const CategorySlider = () => {
    return (
        <div className="py-12 md:py-16 bg-base-200">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-2">Shop by Category</h2>
                <p className="text-center text-gray-500 mb-8">Explore our wide range of products.</p>
                
                <Swiper
                    modules={[Pagination, Navigation, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={2}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        // when window width is >= 640px
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        // when window width is >= 768px
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 30,
                        },
                        // when window width is >= 1024px
                        1024: {
                            slidesPerView: 5,
                            spaceBetween: 30,
                        },
                    }}
                    className="!pb-12" // Add padding bottom for pagination
                >
                    {categories.map((category, index) => (
                        <SwiperSlide key={index}>
                            <div className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer h-full">
                                <div className="card-body items-center text-center">
                                    <div className="text-primary">
                                        {category.icon}
                                    </div>
                                    <h3 className="card-title mt-4">{category.name}</h3>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default CategorySlider;