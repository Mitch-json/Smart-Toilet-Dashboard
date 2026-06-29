import React, { useState } from 'react';
import { BellIcon, CheckIcon, AlertTriangleIcon, InfoIcon, XIcon } from 'lucide-react';
interface Notification {
  id: number;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
}
interface NotificationCenterProps {
  notifications: Notification[];
}
export function NotificationCenter({
  notifications
}: NotificationCenterProps) {
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  const markAsRead = (id: number) => {
    setLocalNotifications(localNotifications.map(notification => notification.id === id ? {
      ...notification,
      read: true
    } : notification));
  };
  const markAllAsRead = () => {
    setLocalNotifications(localNotifications.map(notification => ({
      ...notification,
      read: true
    })));
  };
  const removeNotification = (id: number) => {
    setLocalNotifications(localNotifications.filter(notification => notification.id !== id));
  };
  const getNotificationIcon = (type: string) => {
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
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-l-4 border-yellow-500 bg-yellow-50';
      case 'critical':
        return 'border-l-4 border-red-500 bg-red-50';
      case 'info':
        return 'border-l-4 border-blue-500 bg-blue-50';
      default:
        return 'border-l-4 border-gray-300';
    }
  };
  const unreadCount = localNotifications.filter(n => !n.read).length;
  return <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          <BellIcon className="w-5 h-5 mr-2 text-gray-600" />
          <h2 className="text-lg font-semibold">Notifications</h2>
          {unreadCount > 0 && <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {unreadCount} new
            </span>}
        </div>
        {unreadCount > 0 && <button onClick={markAllAsRead} className="text-sm text-blue-600 hover:text-blue-800">
            Mark all as read
          </button>}
      </div>
      {localNotifications.length === 0 ? <div className="p-8 text-center text-gray-500">
          <BellIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No notifications at this time</p>
        </div> : <div className="divide-y">
          {localNotifications.map(notification => <div key={notification.id} className={`p-4 flex ${getNotificationColor(notification.type)} ${!notification.read ? 'bg-opacity-70' : ''}`}>
              <div className="mr-3">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className={`${!notification.read ? 'font-semibold' : 'font-medium'}`}>
                    {notification.message}
                  </p>
                  <button onClick={() => removeNotification(notification.id)} className="text-gray-400 hover:text-gray-600">
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTimestamp(notification.timestamp)}
                </p>
                {!notification.read && <button onClick={() => markAsRead(notification.id)} className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center">
                    <CheckIcon className="w-3 h-3 mr-1" />
                    Mark as read
                  </button>}
              </div>
            </div>)}
        </div>}
      <div className="p-4 bg-gray-50 rounded-b-lg">
        <h3 className="font-medium mb-2">Notification Settings</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" defaultChecked />
            <span className="text-sm">Email notifications</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" defaultChecked />
            <span className="text-sm">SMS alerts for critical issues</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" defaultChecked />
            <span className="text-sm">Automatic disposal scheduling</span>
          </label>
        </div>
      </div>
    </div>;
}