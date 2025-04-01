
import React from 'react';

export interface SDGBadgeProps {
  sdgNumber: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SDGBadge: React.FC<SDGBadgeProps> = ({ sdgNumber, size = 'md', className = '' }) => {
  const getSDGColor = (num: number): string => {
    const colors: { [key: number]: string } = {
      1: '#e5243b', // No Poverty
      2: '#DDA63A', // Zero Hunger
      3: '#4C9F38', // Good Health and Well-being
      4: '#C5192D', // Quality Education
      5: '#FF3A21', // Gender Equality
      6: '#26BDE2', // Clean Water and Sanitation
      7: '#FCC30B', // Affordable and Clean Energy
      8: '#A21942', // Decent Work and Economic Growth
      9: '#FD6925', // Industry, Innovation, and Infrastructure
      10: '#DD1367', // Reduced Inequalities
      11: '#FD9D24', // Sustainable Cities and Communities
      12: '#BF8B2E', // Responsible Consumption and Production
      13: '#3F7E44', // Climate Action
      14: '#0A97D9', // Life Below Water
      15: '#56C02B', // Life on Land
      16: '#00689D', // Peace, Justice and Strong Institutions
      17: '#19486A', // Partnerships for the Goals
    };
    return colors[num] || '#777777';
  };

  const getSDGName = (num: number): string => {
    const names: { [key: number]: string } = {
      1: 'No Poverty',
      2: 'Zero Hunger',
      3: 'Good Health and Well-being',
      4: 'Quality Education',
      5: 'Gender Equality',
      6: 'Clean Water and Sanitation',
      7: 'Affordable and Clean Energy',
      8: 'Decent Work and Economic Growth',
      9: 'Industry, Innovation, and Infrastructure',
      10: 'Reduced Inequalities',
      11: 'Sustainable Cities and Communities',
      12: 'Responsible Consumption and Production',
      13: 'Climate Action',
      14: 'Life Below Water',
      15: 'Life on Land',
      16: 'Peace, Justice and Strong Institutions',
      17: 'Partnerships for the Goals',
    };
    return names[num] || 'Unknown SDG';
  };

  const sizeClass = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base',
  }[size];

  const color = getSDGColor(sdgNumber);
  const name = getSDGName(sdgNumber);

  return (
    <div
      className={`relative group ${className}`}
      title={`SDG ${sdgNumber}: ${name}`}
    >
      <div
        className={`flex items-center justify-center ${sizeClass} rounded-full font-semibold text-white`}
        style={{ backgroundColor: color }}
      >
        {sdgNumber}
      </div>
      <div className="absolute z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white rounded-md whitespace-nowrap"
           style={{ backgroundColor: color }}
      >
        {name}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-current" style={{ color: color }}></div>
      </div>
    </div>
  );
};

export default SDGBadge;
