import React from 'react';
interface ProgressBarProps {
  percentage: number;
  colorClass: string;
}
export function ProgressBar({
  percentage,
  colorClass
}: ProgressBarProps) {
  return <div className="w-full bg-gray-200 rounded-full h-4">
      <div className={`h-4 rounded-full ${colorClass} transition-all duration-500 ease-in-out`} style={{
      width: `${percentage}%`
    }} />
    </div>;
}