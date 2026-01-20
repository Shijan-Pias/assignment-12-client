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
import UploadPrescription from '../../Prescription/UploadPrescription';
import HowItWorks from '../../Prescription/HowItWork';

const Home = () => {
    return (
        <div>
           <Banner></Banner>
           <CategoryCardSection></CategoryCardSection>
           <UploadPrescription></UploadPrescription>
          <HowItWorks></HowItWorks>
          <DiscountProducts></DiscountProducts>
          <BrandsMarquee></BrandsMarquee>
          <AboutSection></AboutSection>
          <ContactSection></ContactSection>
          

        </div>
    );
};

export default Home;