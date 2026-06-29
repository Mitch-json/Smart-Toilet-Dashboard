import React from 'react';
import { HistoryIcon, SearchIcon } from 'lucide-react';
interface SystemLogsProps {
  logs: Array<{
    id: number;
    event: string;
    timestamp: string;
    details: string;
  }>;
}
export function SystemLogs({
  logs
}: SystemLogsProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  const getEventColor = (event: string) => {
    if (event.includes('Motion')) return 'border-purple-500 bg-purple-50';
    if (event.includes('Opened')) return 'border-green-500 bg-green-50';
    if (event.includes('Closed')) return 'border-red-500 bg-red-50';
    if (event.includes('Level')) return 'border-blue-500 bg-blue-50';
    return 'border-gray-300 bg-gray-50';
  };
  return <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          <HistoryIcon className="w-5 h-5 mr-2 text-blue-600" />
          <h2 className="text-lg font-semibold">System Logs</h2>
        </div>
        <div className="relative">
          <input type="text" placeholder="Search logs..." className="pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="p-4">
        {logs.length === 0 ? <p className="text-center text-gray-500 py-8">
            No system logs available
          </p> : <div className="space-y-4">
            {logs.map(log => <div key={log.id} className={`p-3 border-l-4 rounded-r-md ${getEventColor(log.event)}`}>
                <div className="flex justify-between">
                  <h3 className="font-medium">{log.event}</h3>
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(log.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{log.details}</p>
              </div>)}
          </div>}
      </div>
      <div className="p-4 bg-gray-50 border-t flex justify-between items-center rounded-b-lg">
        <span className="text-sm text-gray-500">
          Showing {logs.length} logs
        </span>
        <div className="flex gap-2">
          <button className="text-sm px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Export Logs
          </button>
          <button className="text-sm px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Clear Logs
          </button>
        </div>
      </div>
    </div>;
}