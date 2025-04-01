
import React from 'react';

type SDGBadgeSize = 'sm' | 'md' | 'lg';

export interface SDGBadgeProps {
  sdgNumber: number;
  size?: SDGBadgeSize;
  className?: string;
  showText?: boolean;
}

const SDGBadge: React.FC<SDGBadgeProps> = ({ 
  sdgNumber, 
  size = 'md', 
  className = '',
  showText = false
}) => {
  // Map of SDG numbers to their colors
  const sdgColors: Record<number, string> = {
    1: 'bg-red-600',      // No Poverty
    2: 'bg-yellow-500',   // Zero Hunger
    3: 'bg-green-500',    // Good Health and Well-being
    4: 'bg-red-500',      // Quality Education
    5: 'bg-orange-500',   // Gender Equality
    6: 'bg-blue-400',     // Clean Water and Sanitation
    7: 'bg-yellow-400',   // Affordable and Clean Energy
    8: 'bg-purple-600',   // Decent Work and Economic Growth
    9: 'bg-orange-600',   // Industry, Innovation and Infrastructure
    10: 'bg-pink-600',    // Reduced Inequality
    11: 'bg-amber-500',   // Sustainable Cities and Communities
    12: 'bg-yellow-600',  // Responsible Consumption and Production
    13: 'bg-green-600',   // Climate Action
    14: 'bg-blue-600',    // Life Below Water
    15: 'bg-lime-500',    // Life on Land
    16: 'bg-indigo-600',  // Peace, Justice and Strong Institutions
    17: 'bg-blue-500',    // Partnerships for the Goals
  };

  // SDG names for tooltips
  const sdgNames: Record<number, string> = {
    1: 'No Poverty',
    2: 'Zero Hunger',
    3: 'Good Health and Well-being',
    4: 'Quality Education',
    5: 'Gender Equality',
    6: 'Clean Water and Sanitation',
    7: 'Affordable and Clean Energy',
    8: 'Decent Work and Economic Growth',
    9: 'Industry, Innovation and Infrastructure',
    10: 'Reduced Inequality',
    11: 'Sustainable Cities and Communities',
    12: 'Responsible Consumption and Production',
    13: 'Climate Action',
    14: 'Life Below Water',
    15: 'Life on Land',
    16: 'Peace, Justice and Strong Institutions',
    17: 'Partnerships for the Goals',
  };

  // Determine badge size
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  const badgeColor = sdgColors[sdgNumber] || 'bg-gray-500';
  const badgeName = sdgNames[sdgNumber] || `SDG ${sdgNumber}`;
  
  return (
    <div className="relative inline-block group">
      <div
        className={`${badgeColor} ${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-semibold ${className}`}
        title={badgeName}
      >
        {sdgNumber}
      </div>
      {showText && <span className="ml-2">{badgeName}</span>}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-xs bg-gray-900 text-white rounded pointer-events-none whitespace-nowrap">
        {badgeName}
      </div>
    </div>
  );
};

export default SDGBadge;
