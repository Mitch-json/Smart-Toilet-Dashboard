import React, { useEffect, useState } from 'react';
import { AlertCircleIcon, InfoIcon, XIcon, CheckCircleIcon } from 'lucide-react';
interface ToastNotificationProps {
  type: string;
  message: string;
  id: number;
}
export function ToastNotification({
  type,
  message,
  id
}: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          setTimeout(() => setIsVisible(false), 200);
          return 0;
        }
        return prev - 2;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [id]);
  if (!isVisible) return null;
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertCircleIcon className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircleIcon className="w-5 h-5 text-red-500" />;
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      default:
        return <InfoIcon className="w-5 h-5 text-blue-500" />;
    }
  };
  const getBgColor = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };
  return <div className="fixed top-5 right-5 z-50 max-w-sm w-full opacity-100 transition-opacity duration-200">
      <div className={`rounded-lg shadow-lg border p-4 ${getBgColor()}`}>
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            <div className="flex-shrink-0">{getIcon()}</div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-gray-900">{message}</p>
            </div>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500" onClick={() => setIsVisible(false)}>
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div className={`h-1 rounded-full ${type === 'warning' ? 'bg-yellow-500' : type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} style={{
            width: `${progress}%`
          }} />
          </div>
        </div>
      </div>
    </div>;
}