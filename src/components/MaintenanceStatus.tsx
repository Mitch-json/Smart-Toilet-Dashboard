import React, { Component } from 'react';
import { CalendarIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
interface MaintenanceStatusProps {
  status: {
    lastService: string;
    nextService: string;
    components: Array<{
      name: string;
      status: string;
    }>;
  };
}
export function MaintenanceStatus({
  status
}: MaintenanceStatusProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const getStatusIcon = (status: string) => {
    if (status === 'Good') {
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    }
    return <AlertCircleIcon className="w-5 h-5 text-yellow-500" />;
  };
  const daysUntilNextService = () => {
    const nextDate = new Date(status.nextService);
    const today = new Date();
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  return <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex items-center">
            <div className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-lg font-semibold">Maintenance Schedule</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-700 mb-2">
                  <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium">Last Service Date</span>
                </div>
                <p className="text-lg font-semibold">
                  {formatDate(status.lastService)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Regular maintenance completed
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-700 mb-2">
                  <CalendarIcon className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="text-sm font-medium">Next Service Date</span>
                </div>
                <p className="text-lg font-semibold">
                  {formatDate(status.nextService)}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {daysUntilNextService()} days remaining
                </p>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="font-medium mb-4">Maintenance Checklist</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-3" />
                  <span>Check and clean sensors</span>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="mr-3" />
                  <span>Inspect waste disposal mechanisms</span>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="mr-3" />
                  <span>Test motion detection system</span>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="mr-3" />
                  <span>Calibrate level indicators</span>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="mr-3" />
                  <span>Update firmware if available</span>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-between">
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
                View Maintenance History
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Schedule Service
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Component Status</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {status.components.map((component, index) => <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div className="flex items-center">
                    {getStatusIcon(component.status)}
                    <span className="ml-2">{component.name}</span>
                  </div>
                  <span className={`text-sm font-medium ${component.status === 'Good' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {component.status}
                  </span>
                </div>)}
            </div>
            <div className="mt-6">
              <h3 className="font-medium mb-2 text-sm">System Health</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{
                width: '85%'
              }}></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">0%</span>
                <span className="text-xs font-medium text-green-600">85%</span>
                <span className="text-xs text-gray-500">100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}