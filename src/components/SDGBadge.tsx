
import React from 'react';

interface SDGBadgeProps {
  sdgNumber: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const SDGBadge: React.FC<SDGBadgeProps> = ({ 
  sdgNumber, 
  size = 'md', 
  showText = false
}) => {
  const sdgInfo: Record<number, { color: string; title: string }> = {
    1: { color: 'bg-red-600', title: 'No Poverty' },
    2: { color: 'bg-yellow-600', title: 'Zero Hunger' },
    3: { color: 'bg-green-600', title: 'Good Health and Well-being' },
    4: { color: 'bg-red-700', title: 'Quality Education' },
    5: { color: 'bg-orange-600', title: 'Gender Equality' },
    6: { color: 'bg-blue-500', title: 'Clean Water and Sanitation' },
    7: { color: 'bg-yellow-500', title: 'Affordable and Clean Energy' },
    8: { color: 'bg-red-500', title: 'Decent Work and Economic Growth' },
    9: { color: 'bg-orange-500', title: 'Industry, Innovation, and Infrastructure' },
    10: { color: 'bg-pink-600', title: 'Reduced Inequality' },
    11: { color: 'bg-yellow-700', title: 'Sustainable Cities and Communities' },
    12: { color: 'bg-amber-700', title: 'Responsible Consumption and Production' },
    13: { color: 'bg-green-700', title: 'Climate Action' },
    14: { color: 'bg-blue-600', title: 'Life Below Water' },
    15: { color: 'bg-green-500', title: 'Life on Land' },
    16: { color: 'bg-blue-700', title: 'Peace, Justice, and Strong Institutions' },
    17: { color: 'bg-blue-800', title: 'Partnerships for the Goals' }
  };

  const info = sdgInfo[sdgNumber] || { color: 'bg-gray-500', title: 'Unknown SDG' };
  
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base'
  };

  return (
    <div className="flex items-center gap-2">
      <div 
        className={`${info.color} ${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-semibold`}
      >
        {sdgNumber}
      </div>
      {showText && (
        <span className="text-sm font-medium">{info.title}</span>
      )}
    </div>
  );
};

export default SDGBadge;
