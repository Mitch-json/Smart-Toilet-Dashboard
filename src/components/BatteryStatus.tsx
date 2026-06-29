import React from 'react';
import { BatteryIcon, BatteryFullIcon, BatteryLowIcon, BatteryWarningIcon, BatteryChargingIcon } from 'lucide-react';
interface BatteryStatusProps {
  level: number;
}
export function BatteryStatus({
  level
}: BatteryStatusProps) {
  const getBatteryColor = (level: number) => {
    if (level > 70) return 'bg-green-500';
    if (level > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  const getBatteryIcon = (level: number) => {
    if (level > 70) return <BatteryFullIcon className="w-6 h-6 text-green-500" />;
    if (level > 30) return <BatteryIcon className="w-6 h-6 text-yellow-500" />;
    if (level > 10) return <BatteryLowIcon className="w-6 h-6 text-red-500" />;
    return <BatteryWarningIcon className="w-6 h-6 text-red-500" />;
  };
  const getBatteryStatus = (level: number) => {
    if (level > 70) return 'Good';
    if (level > 30) return 'Moderate';
    if (level > 10) return 'Low';
    return 'Critical';
  };
  return <div className="mt-4">
      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div className={`h-4 rounded-full ${getBatteryColor(level)} transition-all duration-500 ease-in-out`} style={{
        width: `${level}%`
      }} />
      </div>
      <div className="flex justify-between mt-2">
        <div className="flex items-center">
          {getBatteryIcon(level)}
          <span className="ml-2 text-sm font-medium">
            {getBatteryStatus(level)}
          </span>
        </div>
        <span className="text-sm font-semibold">{level.toFixed(1)}%</span>
      </div>
      <div className="mt-4 text-xs text-gray-500">
        {level < 20 ? <div className="flex items-center text-red-500">
            <BatteryWarningIcon className="w-4 h-4 mr-1" />
            <span>Battery needs charging soon</span>
          </div> : level < 50 ? <span>Estimated 5 days remaining</span> : <span>Estimated 12 days remaining</span>}
      </div>
    </div>;
}