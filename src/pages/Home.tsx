import React from 'react';
import Hero from '../sections/Hero';
import Features from '../sections/Features';
import HowItWorks from '../sections/HowItWorks';
import CTA from '../sections/CTA';

const Home: React.FC = () => {
  return (
    <div className="pb-20">
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
    </div>
  );
};

export default Home;
