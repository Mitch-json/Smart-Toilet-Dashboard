import React from 'react';
interface StatusCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}
export function StatusCard({
  title,
  icon,
  children
}: StatusCardProps) {
  return <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="mr-4">{icon}</div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>;
}