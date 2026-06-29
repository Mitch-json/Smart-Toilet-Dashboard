import React, { useState } from 'react';
import { Header } from './Header';
import { StatusCard } from './StatusCard';
import { ProgressBar } from './ProgressBar';
import { NotificationCenter } from './NotificationCenter';
import { DisposalScheduling } from './DisposalScheduling';
import { UsageAnalytics } from './UsageAnalytics';
import { MaintenanceStatus } from './MaintenanceStatus';
import { AlertHistory } from './AlertHistory';
import { SystemLogs } from './SystemLogs';
import { BatteryStatus } from './BatteryStatus';
import { UsageCounter } from './UsageCounter';
import { ManualControls } from './ManualControls';
import { HistoricalCharts } from './HistoricalCharts';
import { ToastNotification } from './ToastNotification';
import { FaceRecognition } from './FaceRecognition';
import { DropletIcon, PackageIcon, EyeIcon, ToggleRightIcon, ChartBarIcon, BellIcon, ClockIcon, HistoryIcon, BatteryIcon, GaugeIcon, LineChartIcon, Droplets, Leaf, FlaskConical } from 'lucide-react';
interface DashboardProps {
  data: {
    liquidLevel: number;
    solidLevel: number;
    motionDetected: boolean;
    relayStatus: boolean;
    batteryLevel: number;
    totalUsageCount: number;
    notifications: Array<{
      id: number;
      type: string;
      message: string;
      timestamp: string;
      read: boolean;
    }>;
    systemLogs: Array<{
      id: number;
      event: string;
      timestamp: string;
      details: string;
    }>;
    disposalHistory: Array<{
      id: number;
      date: string;
      type: string;
      amount: string;
    }>;
    nextScheduledDisposal: string;
    usageStats: {
      dailyAverage: number;
      weeklyTotal: number;
      peakHours: number[];
    };
    maintenanceStatus: {
      lastService: string;
      nextService: string;
      components: Array<{
        name: string;
        status: string;
      }>;
    };
    historicalData: {
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
  };
  toastNotification: {
    type: string;
    message: string;
    id: number;
  } | null;
  onToggleRelay: () => void;
  picoConnected?: boolean;
}
export function Dashboard({
  data,
  toastNotification,
  onToggleRelay,
  picoConnected = false
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState('status');
  const getLevelColor = (level: number) => {
    if (level < 40) return 'bg-green-500';
    if (level < 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  const unreadNotifications = data.notifications.filter(n => !n.read).length;
  // Calculate water savings based on usage count (assuming 6L per conventional flush)
  const waterSavings = data.totalUsageCount * 6; // in liters
  return <div className="w-full">
      <Header unreadNotifications={unreadNotifications} />
      {/* Waterless System Banner */}
      <div className="bg-green-50 border-b border-green-100">
        <div className="container mx-auto px-4 py-2 flex items-center justify-center relative">
          <Leaf className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-green-800 font-medium text-sm">
            Waterless Technology - Saving Water, One Use at a Time
          </span>
          <div className="absolute right-4 flex items-center">
            <span className={`w-2 h-2 rounded-full mr-2 ${picoConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className={`text-xs font-medium ${picoConnected ? 'text-green-700' : 'text-gray-500'}`}>
              {picoConnected ? 'Pico Connected' : 'Demo Mode (mock data)'}
            </span>
          </div>
        </div>
      </div>
      {/* Toast Notification */}
      {toastNotification && <ToastNotification type={toastNotification.type} message={toastNotification.message} id={toastNotification.id} />}
      {/* Tab navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            <button onClick={() => setActiveTab('status')} className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'status' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
              System Status
            </button>
            <button onClick={() => setActiveTab('logs')} className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'logs' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
              System Logs
            </button>
            <button onClick={() => setActiveTab('controls')} className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'controls' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
              Manual Controls
            </button>
            <button onClick={() => setActiveTab('face')} className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'face' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
              Face Recognition
            </button>
            <button onClick={() => setActiveTab('historical')} className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'historical' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
              Historical Data
            </button>
            <button onClick={() => setActiveTab('notifications')} className={`px-4 py-3 font-medium text-sm whitespace-nowrap flex items-center ${activeTab === 'notifications' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
              Notifications
              {unreadNotifications > 0 && <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>}
            </button>
            <button onClick={() => setActiveTab('disposal')} className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'disposal' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
              Waste Collection
            </button>
            <button onClick={() => setActiveTab('analytics')} className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'analytics' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
              Usage Analytics
            </button>
            <button onClick={() => setActiveTab('maintenance')} className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'maintenance' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
              Maintenance
            </button>
            <button onClick={() => setActiveTab('eco')} className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'eco' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}>
              Eco Impact
            </button>
          </div>
        </div>
      </div>
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'status' && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatusCard title="Urine Collection" icon={<FlaskConical className="w-6 h-6 text-yellow-600" />}>
              <div className="mt-4">
                <ProgressBar percentage={data.liquidLevel} colorClass={getLevelColor(data.liquidLevel)} />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-600">Current Level</span>
                  <span className="text-sm font-semibold">
                    {data.liquidLevel.toFixed(1)}%
                  </span>
                </div>
              </div>
            </StatusCard>
            <StatusCard title="Solid Waste Collection" icon={<PackageIcon className="w-6 h-6 text-brown-600" />}>
              <div className="mt-4">
                <ProgressBar percentage={data.solidLevel} colorClass={getLevelColor(data.solidLevel)} />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-600">Current Level</span>
                  <span className="text-sm font-semibold">
                    {data.solidLevel.toFixed(1)}%
                  </span>
                </div>
              </div>
            </StatusCard>
            <StatusCard title="Power (Mains)" icon={<BatteryIcon className="w-6 h-6 text-green-600" />}>
              <BatteryStatus level={data.batteryLevel} />
            </StatusCard>
            
            <StatusCard title="Separation Gate" icon={<ToggleRightIcon className="w-6 h-6 text-indigo-600" />}>
              <div className="mt-4 flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 ${data.relayStatus ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="font-medium">
                  {data.relayStatus ? 'OPEN' : 'CLOSED'}
                </span>
              </div>
            </StatusCard>
            <StatusCard title="Usage Count" icon={<GaugeIcon className="w-6 h-6 text-orange-600" />}>
              <UsageCounter count={data.totalUsageCount} />
            </StatusCard>
          </div>}
        {activeTab === 'logs' && <SystemLogs logs={data.systemLogs} />}
        {activeTab === 'controls' && <ManualControls relayStatus={data.relayStatus} onToggleRelay={onToggleRelay} />}
        {activeTab === 'face' && <FaceRecognition />}
        {activeTab === 'historical' && <HistoricalCharts data={data.historicalData} />}
        {activeTab === 'notifications' && <NotificationCenter notifications={data.notifications} />}
        {activeTab === 'disposal' && <DisposalScheduling disposalHistory={data.disposalHistory} nextScheduledDisposal={data.nextScheduledDisposal} liquidLevel={data.liquidLevel} solidLevel={data.solidLevel} />}
        {activeTab === 'analytics' && <UsageAnalytics stats={data.usageStats} />}
        {activeTab === 'maintenance' && <MaintenanceStatus status={data.maintenanceStatus} />}
        {activeTab === 'history' && <AlertHistory notifications={data.notifications} />}
        {activeTab === 'eco' && <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex items-center">
              <Leaf className="w-5 h-5 mr-2 text-green-600" />
              <h2 className="text-lg font-semibold">Environmental Impact</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-50 p-6 rounded-lg text-center">
                  <Droplets className="w-10 h-10 mx-auto mb-4 text-green-600" />
                  <h3 className="text-xl font-bold text-green-800">
                    {waterSavings.toLocaleString()}
                  </h3>
                  <p className="text-sm text-green-700">
                    Liters of Water Saved
                  </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg text-center">
                  <Leaf className="w-10 h-10 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-xl font-bold text-blue-800">
                    {(waterSavings * 0.001 * 0.5).toFixed(2)}
                  </h3>
                  <p className="text-sm text-blue-700">
                    Tons CO₂ Emissions Reduced
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg text-center">
                  <FlaskConical className="w-10 h-10 mx-auto mb-4 text-purple-600" />
                  <h3 className="text-xl font-bold text-purple-800">
                    {(data.totalUsageCount * 0.5).toFixed(1)}
                  </h3>
                  <p className="text-sm text-purple-700">
                    Kg Nutrients Recovered
                  </p>
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">
                  How EGERLOO's Waterless Technology Works
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="mb-3">
                    EGERLOO uses an innovative separation system that collects
                    urine and solid waste separately without using any water:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>
                      <span className="font-medium">Urine Collection:</span>{' '}
                      Liquid waste is directed to a separate container where it
                      can be safely stored until disposal.
                    </li>
                    <li>
                      <span className="font-medium">
                        Solid Waste Collection:
                      </span>{' '}
                      Solid waste is collected in a separate compartment with
                      odor-control technology.
                    </li>
                    <li>
                      <span className="font-medium">No Water Required:</span>{' '}
                      Unlike traditional toilets that use 6-9 liters per flush,
                      EGERLOO requires zero water for operation.
                    </li>
                    <li>
                      <span className="font-medium">Separation Gate:</span> A
                      specially designed gate ensures proper separation of waste
                      types.
                    </li>
                    <li>
                      <span className="font-medium">Odor Control:</span>{' '}
                      Advanced ventilation and sealing technology prevents odors
                      without chemical additives.
                    </li>
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Environmental Benefits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-700 mb-2">
                      Water Conservation
                    </h4>
                    <p className="text-sm">
                      By eliminating water usage, ELGERLOO saves thousands of
                      liters annually per unit, reducing strain on water
                      resources.
                    </p>
                  </div>
                  <div className="border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-700 mb-2">
                      Reduced Infrastructure
                    </h4>
                    <p className="text-sm">
                      No need for water pipes, sewage connections, or treatment
                      facilities, making installation possible anywhere.
                    </p>
                  </div>
                  <div className="border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-700 mb-2">
                      Resource Recovery
                    </h4>
                    <p className="text-sm">
                      Separated waste enables nutrient recovery for agricultural
                      use, closing the nutrient cycle.
                    </p>
                  </div>
                  <div className="border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-700 mb-2">
                      Carbon Footprint
                    </h4>
                    <p className="text-sm">
                      Lower energy requirements for waste treatment and water
                      pumping reduce overall carbon emissions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>}
      </main>
    </div>;
}
