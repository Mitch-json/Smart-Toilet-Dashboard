import React, { useState } from 'react';
import { BellIcon } from 'lucide-react';
interface HeaderProps {
  unreadNotifications?: number;
}
export function Header({
  unreadNotifications = 0
}: HeaderProps) {
  return <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">EGERLOO</h1>
            <p className="text-gray-600">IoT Powered Smart Toilet Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <BellIcon className="w-6 h-6 text-gray-600" />
                {unreadNotifications > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadNotifications}
                  </span>}
              </button>
            </div>
            <div className="bg-blue-600 text-white px-4 py-2 rounded-md shadow">
              <span className="font-medium">LIVE</span>
            </div>
          </div>
        </div>
      </div>
    </header>;
}
