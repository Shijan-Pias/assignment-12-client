import React from 'react';
import Banner from './Banner';
import TrustedPartners from './FirstExtra';
import HealthCategories from './FirstExtra';
import CategorySlider from './FirstExtra';
import BrandsMarquee from './SecondSection';
import CategoryCardSection from './CategoryCardSection';
import DiscountProducts from './DiscountProduct';
import AboutSection from './About';
import ContactSection from './Contact';

const Home = () => {
    return (
        <div>
           <Banner></Banner>
          <CategorySlider></CategorySlider>
          <CategoryCardSection></CategoryCardSection>
          <DiscountProducts></DiscountProducts>
          <BrandsMarquee></BrandsMarquee>
          <AboutSection></AboutSection>
          <ContactSection></ContactSection>
          

        </div>
    );
};

export default Home;