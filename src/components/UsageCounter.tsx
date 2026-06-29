import React from 'react';
import { ActivityIcon } from 'lucide-react';
interface UsageCounterProps {
  count: number;
}
export function UsageCounter({
  count
}: UsageCounterProps) {
  return <div className="mt-4">
      <div className="flex items-center justify-center">
        <div className="text-3xl font-bold text-gray-800">
          {count.toLocaleString()}
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Today: 24</span>
          <span>This week: 168</span>
          <span>This month: 720</span>
        </div>
        <div className="mt-4 text-center">
          <div className="inline-flex items-center text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
            <ActivityIcon className="w-4 h-4 mr-1" />
            <span>Active system</span>
          </div>
        </div>
      </div>
    </div>;
}