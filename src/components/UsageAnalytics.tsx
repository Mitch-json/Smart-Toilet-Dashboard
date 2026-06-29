import React from 'react';
import { ChartBarIcon, UsersIcon, ClockIcon } from 'lucide-react';
interface UsageAnalyticsProps {
  stats: {
    dailyAverage: number;
    weeklyTotal: number;
    peakHours: number[];
  };
}
export function UsageAnalytics({
  stats
}: UsageAnalyticsProps) {
  // Generate mock data for the chart
  const generateDailyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      usage: Math.floor(Math.random() * 30) + 10
    }));
  };
  const dailyData = generateDailyData();
  const maxUsage = Math.max(...dailyData.map(d => d.usage));
  return <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <ChartBarIcon className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-lg font-semibold">Weekly Usage Pattern</h2>
          </div>
          {/* Simple bar chart */}
          <div className="h-64">
            <div className="flex h-full items-end space-x-2">
              {dailyData.map((item, index) => <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-blue-500 rounded-t" style={{
                height: `${item.usage / maxUsage * 100}%`,
                minHeight: '10%'
              }} />
                  <div className="text-xs mt-2">{item.day}</div>
                  <div className="text-xs text-gray-500">{item.usage}</div>
                </div>)}
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Daily Average</div>
              <div className="text-2xl font-bold">{stats.dailyAverage}</div>
              <div className="text-xs text-gray-500">uses per day</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Weekly Total</div>
              <div className="text-2xl font-bold">{stats.weeklyTotal}</div>
              <div className="text-xs text-gray-500">total uses</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Efficiency Rating</div>
              <div className="text-2xl font-bold">92%</div>
              <div className="text-xs text-gray-500">water conservation</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <ClockIcon className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-lg font-semibold">Peak Usage Hours</h2>
          </div>
          <div className="space-y-4">
            {stats.peakHours.map((hour, index) => <div key={index} className="flex items-center">
                <div className="w-8 text-right mr-2 text-gray-600">
                  {hour}:00
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{
                width: `${80 - index * 15}%`
              }} />
                </div>
                <div className="w-12 text-right ml-2 text-xs text-gray-500">
                  {80 - index * 15}%
                </div>
              </div>)}
          </div>
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-medium mb-4">Usage Insights</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></div>
                <span>Peak usage occurs during morning hours</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></div>
                <span>20% increase in usage compared to last week</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></div>
                <span>Average usage duration: 3.5 minutes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>;
}