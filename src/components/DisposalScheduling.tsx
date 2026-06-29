import React, { useState } from 'react';
import { CalendarIcon, TruckIcon, HistoryIcon, AlertTriangleIcon, FlaskConical, PackageIcon } from 'lucide-react';
interface DisposalSchedulingProps {
  disposalHistory: Array<{
    id: number;
    date: string;
    type: string;
    amount: string;
  }>;
  nextScheduledDisposal: string;
  liquidLevel: number;
  solidLevel: number;
}
export function DisposalScheduling({
  disposalHistory,
  nextScheduledDisposal,
  liquidLevel,
  solidLevel
}: DisposalSchedulingProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('normal');
  const [wasteType, setWasteType] = useState('both');
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const handleScheduleDisposal = () => {
    alert('Collection scheduled! A confirmation will be sent to your registered contact methods.');
  };
  const isEmergency = liquidLevel > 85 || solidLevel > 85;
  return <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-lg font-semibold">Schedule Waste Collection</h2>
          </div>
          <div className="p-6">
            {isEmergency && <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex items-center">
                  <AlertTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-700 font-medium">
                    Urgent collection required! Collection tanks are reaching
                    capacity.
                  </p>
                </div>
              </div>}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Next Scheduled Collection:</h3>
              <div className="flex items-center text-gray-700">
                <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
                <span>{formatDate(nextScheduledDisposal)}</span>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="font-medium mb-2">Collection Type:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="wasteType" value="urine" checked={wasteType === 'urine'} onChange={() => setWasteType('urine')} className="mr-2" />
                  <div className="flex items-center">
                    <FlaskConical className="w-5 h-5 mr-2 text-yellow-600" />
                    <span>Urine Only</span>
                  </div>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="wasteType" value="solid" checked={wasteType === 'solid'} onChange={() => setWasteType('solid')} className="mr-2" />
                  <div className="flex items-center">
                    <PackageIcon className="w-5 h-5 mr-2 text-brown-600" />
                    <span>Solid Waste Only</span>
                  </div>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="wasteType" value="both" checked={wasteType === 'both'} onChange={() => setWasteType('both')} className="mr-2" />
                  <div className="flex items-center">
                    <TruckIcon className="w-5 h-5 mr-2 text-blue-600" />
                    <span>Both</span>
                  </div>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Date
                </label>
                <input type="date" className="w-full p-2 border rounded-md" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Time
                </label>
                <input type="time" className="w-full p-2 border rounded-md" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Urgency Level
              </label>
              <select className="w-full p-2 border rounded-md" value={urgencyLevel} onChange={e => setUrgencyLevel(e.target.value)}>
                <option value="normal">Normal - Schedule within 7 days</option>
                <option value="priority">
                  Priority - Schedule within 48 hours
                </option>
                <option value="urgent">
                  Urgent - Schedule within 24 hours
                </option>
                <option value="emergency">Emergency - Same day service</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea className="w-full p-2 border rounded-md" rows={3} placeholder="Any special instructions for the collection team?" />
            </div>
            <div className="flex justify-end">
              <button onClick={handleScheduleDisposal} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
                <TruckIcon className="w-4 h-4 mr-2" />
                Schedule Collection
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex items-center">
            <HistoryIcon className="w-5 h-5 mr-2 text-gray-600" />
            <h2 className="text-lg font-semibold">Collection History</h2>
          </div>
          <div className="p-4">
            {disposalHistory.length === 0 ? <p className="text-gray-500 text-center py-4">
                No collection history available
              </p> : <div className="space-y-4">
                {disposalHistory.map(item => <div key={item.id} className="border-b pb-3 last:border-0">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        {item.type.includes('Liquid') || item.type.includes('Urine') ? <FlaskConical className="w-4 h-4 mr-2 text-yellow-600" /> : <PackageIcon className="w-4 h-4 mr-2 text-brown-600" />}
                        <span className="font-medium">{item.type}</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {item.amount}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  </div>)}
              </div>}
          </div>
          <div className="p-4 bg-gray-50 rounded-b-lg">
            <h3 className="font-medium mb-2 text-sm">
              Waste Management Partners
            </h3>
            <div className="flex items-center">
              <TruckIcon className="w-4 h-4 mr-2 text-blue-600" />
              <span className="text-sm">EcoWaste Solutions, Inc.</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Contact: (555) 123-4567
            </p>
            <div className="mt-3 text-xs text-green-600">
              <p>✓ Certified for waterless toilet waste management</p>
              <p>✓ Nutrient recovery and composting facilities</p>
            </div>
          </div>
        </div>
      </div>
    </div>;
}