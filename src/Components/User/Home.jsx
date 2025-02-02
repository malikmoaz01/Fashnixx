// Home.jsx

import React from 'react';
import HeroSection from '../User/HeroSection';
import BelowHero1 from '../User/BelowHero1';
import SaleComponent from '../User/SaleComponent';
import BelowHero from '../User/BelowHero';
import Recommended from '../User/Recomended';

const Home = () => {
  return (
    <div>
      <HeroSection />
      <BelowHero1 />
      <SaleComponent />
      <BelowHero />
      <Recommended />
    </div>
  );
};

export default Home;
