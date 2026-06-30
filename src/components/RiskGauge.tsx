import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface RiskGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ score, size = 200, strokeWidth = 15 }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayScore / 100) * circumference;

  useEffect(() => {
    // Animate the counter
    let start = 0;
    const duration = 1500;
    const frames = duration / 16;
    const increment = score / frames;

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [score]);

  const getColor = (s: number) => {
    if (s <= 30) return '#10B981'; // success (Green)
    if (s <= 60) return '#F59E0B'; // warning (Yellow)
    if (s <= 80) return '#EF4444'; // danger (Red)
    return '#7C3AED'; // critical (Purple)
  };

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl font-heading font-bold text-white"
        >
          {displayScore}
        </motion.span>
        <span className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">Risk Score</span>
      </div>
    </div>
  );
};

export default RiskGauge;
