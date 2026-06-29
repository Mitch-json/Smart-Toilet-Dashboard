import React from 'react';
import { PowerIcon, ToggleLeftIcon, ToggleRightIcon, RefreshCwIcon, BellIcon, FlaskConical, PackageIcon, Fan } from 'lucide-react';
interface ManualControlsProps {
  relayStatus: boolean;
  onToggleRelay: () => void;
}
export function ManualControls({
  relayStatus,
  onToggleRelay
}: ManualControlsProps) {
  return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex items-center">
          <ToggleRightIcon className="w-5 h-5 mr-2 text-blue-600" />
          <h2 className="text-lg font-semibold">Manual Controls</h2>
        </div>
        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">
              Separation Gate Control
            </h3>
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
              <div>
                <h4 className="font-medium">Current Status:</h4>
                <div className="flex items-center mt-2">
                  <div className={`w-3 h-3 rounded-full mr-2 ${relayStatus ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={relayStatus ? 'text-green-700' : 'text-red-700'}>
                    {relayStatus ? 'OPEN' : 'CLOSED'}
                  </span>
                </div>
              </div>
              <button onClick={onToggleRelay} className={`flex items-center px-4 py-2 rounded-md ${relayStatus ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                {relayStatus ? <>
                    <ToggleLeftIcon className="w-5 h-5 mr-2" />
                    Close Gate
                  </> : <>
                    <ToggleRightIcon className="w-5 h-5 mr-2" />
                    Open Gate
                  </>}
              </button>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p>
                Manually control the waste separation gate for maintenance or
                testing purposes.
              </p>
              <p className="mt-2 text-yellow-600">
                <strong>Note:</strong> The system will return to automatic
                control after 5 minutes.
              </p>
            </div>
          </div>
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">
              Waterless System Controls
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center justify-center px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Fan className="w-5 h-5 mr-2 text-blue-600" />
                <span>Ventilation Fan</span>
              </button>
              <button className="flex items-center justify-center px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200">
                <FlaskConical className="w-5 h-5 mr-2 text-yellow-600" />
                <span>Urine Diverter</span>
              </button>
              <button className="flex items-center justify-center px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200">
                <PackageIcon className="w-5 h-5 mr-2 text-brown-600" />
                <span>Solid Compactor</span>
              </button>
              <button className="flex items-center justify-center px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200">
                <BellIcon className="w-5 h-5 mr-2 text-blue-600" />
                <span>Test Alarm</span>
              </button>
              <button className="flex items-center justify-center px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200">
                <RefreshCwIcon className="w-5 h-5 mr-2 text-green-600" />
                <span>Reset Sensors</span>
              </button>
              <button className="flex items-center justify-center px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 text-red-600">
                <PowerIcon className="w-5 h-5 mr-2" />
                <span>Power Off</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">
            Waterless System Information
          </h2>
        </div>
        <div className="p-6">
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-green-800 mb-2">
              Waterless Operation
            </h3>
            <p className="text-sm text-green-700">
              This system operates entirely without water, separating waste
              streams for efficient collection and environmentally friendly
              disposal.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Device ID</span>
              <span className="text-gray-600">ELGR-2023-0042</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Firmware Version</span>
              <span className="text-gray-600">v2.3.7</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Last Updated</span>
              <span className="text-gray-600">2023-05-15</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Uptime</span>
              <span className="text-gray-600">32 days, 7 hours</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">IP Address</span>
              <span className="text-gray-600">192.168.1.42</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Connection</span>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-gray-600">Online (Wi-Fi)</span>
              </div>
            </div>
            <div className="flex justify-between pb-2">
              <span className="font-medium">Signal Strength</span>
              <div className="flex">
                <div className="w-1 h-3 bg-green-500 rounded-sm mx-0.5"></div>
                <div className="w-1 h-5 bg-green-500 rounded-sm mx-0.5"></div>
                <div className="w-1 h-7 bg-green-500 rounded-sm mx-0.5"></div>
                <div className="w-1 h-9 bg-green-500 rounded-sm mx-0.5"></div>
                <div className="w-1 h-11 bg-gray-200 rounded-sm mx-0.5"></div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
              <RefreshCwIcon className="w-4 h-4 mr-1" />
              Update Firmware
            </button>
          </div>
        </div>
      </div>
    </div>;
}