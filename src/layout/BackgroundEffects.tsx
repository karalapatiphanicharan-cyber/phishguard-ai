import React from 'react';

const BackgroundEffects: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
      {/* Animated Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Radial Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-accent-secondary/10 rounded-full blur-[100px]" />
    </div>
  );
};

export default BackgroundEffects;
