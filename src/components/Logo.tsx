import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className, size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Shield Base */}
      <path
        d="M50 5L15 20V45C15 68.5 50 88 50 88C50 88 85 68.5 85 45V20L50 5Z"
        fill="currentColor"
      />
      {/* Integrated 'P' Cutout */}
      <path
        d="M42 32V68M42 32H55C63 32 68 37 68 45C68 53 63 58 55 58H42"
        stroke="#050816"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Modern detail: Security core in the center of P's loop */}
      <circle cx="55" cy="45" r="3" fill="#050816" />
    </svg>
  );
};

export default Logo;
