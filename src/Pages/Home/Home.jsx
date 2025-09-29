import React from 'react';
import Banner from './Banner';
import TrustedPartners from './FirstExtra';
import HealthCategories from './FirstExtra';
import CategorySlider from './FirstExtra';
import BrandsMarquee from './SecondSection';
import CategoryCardSection from './CategoryCardSection';
import DiscountProducts from './DiscountProduct';

const Home = () => {
    return (
        <div>
           <Banner></Banner>
          <CategorySlider></CategorySlider>
          <CategoryCardSection></CategoryCardSection>
          <DiscountProducts></DiscountProducts>
          <BrandsMarquee></BrandsMarquee>
          

        </div>
    );
};

export default Home;