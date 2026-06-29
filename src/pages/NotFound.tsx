import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import GradientButton from '../components/GradientButton';
import AnimatedContainer from '../components/AnimatedContainer';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <AnimatedContainer className="text-center">
        <div className="inline-flex p-6 rounded-full bg-danger/10 text-danger mb-8">
          <ShieldAlert className="w-16 h-16" />
        </div>
        <h1 className="text-6xl md:text-8xl font-heading font-bold mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">Security Breach! Page Not Found</h2>
        <p className="text-text-secondary text-lg mb-10 max-w-md mx-auto">
          The page you are looking for has been moved, deleted, or never existed
           in our secure perimeter.
        </p>
        <Link to="/">
          <GradientButton size="lg">
            Return to Base
          </GradientButton>
        </Link>
      </AnimatedContainer>
    </div>
  );
};

export default NotFound;
