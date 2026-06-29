import React from 'react';
import { ClockIcon, AlertTriangleIcon, InfoIcon } from 'lucide-react';
interface Notification {
  id: number;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
}
interface AlertHistoryProps {
  notifications: Notification[];
}
export function AlertHistory({
  notifications
}: AlertHistoryProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'critical':
        return <AlertTriangleIcon className="w-5 h-5 text-red-500" />;
      case 'info':
        return <InfoIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <InfoIcon className="w-5 h-5 text-gray-500" />;
    }
  };
  // Sort notifications by timestamp (newest first)
  const sortedNotifications = [...notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex items-center">
        <ClockIcon className="w-5 h-5 mr-2 text-blue-600" />
        <h2 className="text-lg font-semibold">Alert History</h2>
      </div>
      <div className="p-4">
        <div className="space-y-2">
          {sortedNotifications.length === 0 ? <p className="text-gray-500 text-center py-8">
              No alert history available
            </p> : <div>
              <div className="grid grid-cols-12 gap-4 py-2 border-b font-medium text-gray-700 text-sm">
                <div className="col-span-2">Type</div>
                <div className="col-span-6">Message</div>
                <div className="col-span-3">Time</div>
                <div className="col-span-1">Status</div>
              </div>
              {sortedNotifications.map(notification => <div key={notification.id} className="grid grid-cols-12 gap-4 py-3 border-b text-sm items-center">
                  <div className="col-span-2 flex items-center">
                    {getAlertIcon(notification.type)}
                    <span className="ml-2 capitalize">{notification.type}</span>
                  </div>
                  <div className="col-span-6">{notification.message}</div>
                  <div className="col-span-3 text-gray-500">
                    {formatTimestamp(notification.timestamp)}
                  </div>
                  <div className="col-span-1">
                    <span className={`px-2 py-1 rounded-full text-xs ${notification.read ? 'bg-gray-100 text-gray-600' : 'bg-yellow-100 text-yellow-800'}`}>
                      {notification.read ? 'Read' : 'New'}
                    </span>
                  </div>
                </div>)}
            </div>}
        </div>
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {sortedNotifications.length} alerts
          </div>
          <div>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 text-sm">
              Export History
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 bg-gray-50 rounded-b-lg">
        <h3 className="font-medium mb-2 text-sm">Alert Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" defaultChecked />
            <span className="text-sm">Critical alerts</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" defaultChecked />
            <span className="text-sm">Warning alerts</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" defaultChecked />
            <span className="text-sm">Informational alerts</span>
          </label>
        </div>
      </div>
    </div>;
}