import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LineChartIcon, CalendarIcon, FilterIcon } from 'lucide-react';
interface HistoricalChartsProps {
  data: {
    liquidLevels: Array<{
      date: string;
      value: number;
    }>;
    solidLevels: Array<{
      date: string;
      value: number;
    }>;
    usageCounts: Array<{
      date: string;
      value: number;
    }>;
  };
}
export function HistoricalCharts({
  data
}: HistoricalChartsProps) {
  const [timeRange, setTimeRange] = useState('week');
  const [chartType, setChartType] = useState('all');
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  // Combine data for multi-line chart
  const combinedData = data.liquidLevels.map((item, index) => ({
    date: formatDate(item.date),
    'Liquid Level': item.value,
    'Solid Level': data.solidLevels[index].value,
    'Usage Count': data.usageCounts[index].value
  }));
  return <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          <LineChartIcon className="w-5 h-5 mr-2 text-blue-600" />
          <h2 className="text-lg font-semibold">Historical Data</h2>
        </div>
        <div className="flex space-x-2">
          <div className="relative">
            <select value={timeRange} onChange={e => setTimeRange(e.target.value)} className="pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="day">Last 24 Hours</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last 12 Months</option>
            </select>
            <CalendarIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="relative">
            <select value={chartType} onChange={e => setChartType(e.target.value)} className="pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Metrics</option>
              <option value="liquid">Liquid Level</option>
              <option value="solid">Solid Level</option>
              <option value="usage">Usage Count</option>
            </select>
            <FilterIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={combinedData} margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {(chartType === 'all' || chartType === 'liquid') && <Line type="monotone" dataKey="Liquid Level" stroke="#3b82f6" activeDot={{
              r: 8
            }} strokeWidth={2} />}
              {(chartType === 'all' || chartType === 'solid') && <Line type="monotone" dataKey="Solid Level" stroke="#8b5cf6" strokeWidth={2} />}
              {(chartType === 'all' || chartType === 'usage') && <Line type="monotone" dataKey="Usage Count" stroke="#10b981" strokeWidth={2} />}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Average Liquid Level</div>
            <div className="text-2xl font-bold">48.3%</div>
            <div className="text-xs text-blue-600 mt-1">
              +5.2% from previous period
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Average Solid Level</div>
            <div className="text-2xl font-bold">29.6%</div>
            <div className="text-xs text-purple-600 mt-1">
              +3.8% from previous period
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Total Usage</div>
            <div className="text-2xl font-bold">168</div>
            <div className="text-xs text-green-600 mt-1">
              +12% from previous period
            </div>
          </div>
        </div>
        <div className="mt-6 text-sm text-gray-500">
          <p>
            <strong>Note:</strong> Historical data is collected every hour and
            aggregated for display. For more detailed analysis, you can export
            the raw data using the button below.
          </p>
          <div className="mt-4 flex justify-end">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 text-sm">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>;
}