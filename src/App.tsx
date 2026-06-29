import React, { useEffect, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { fetchStatus, sendCommand } from './config/pico';
export function App() {
  // Mock data - would be replaced with real API calls in production
  const [toiletData, setToiletData] = useState({
    liquidLevel: 65,
    solidLevel: 42,
    motionDetected: true,
    relayStatus: false,
    batteryLevel: 78,
    totalUsageCount: 1247,
    // New mock data for additional features
    notifications: [{
      id: 1,
      type: 'warning',
      message: 'Liquid tank at 85% capacity',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false
    }, {
      id: 2,
      type: 'critical',
      message: 'Solid waste tank requires disposal',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: false
    }, {
      id: 3,
      type: 'info',
      message: 'Scheduled maintenance in 3 days',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true
    }],
    systemLogs: [{
      id: 1,
      event: 'Motion Detected',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      details: 'PIR sensor activated'
    }, {
      id: 2,
      event: 'Waste Gate Opened',
      timestamp: new Date(Date.now() - 118000).toISOString(),
      details: 'Relay activated'
    }, {
      id: 3,
      event: 'Waste Gate Closed',
      timestamp: new Date(Date.now() - 110000).toISOString(),
      details: 'Relay deactivated'
    }, {
      id: 4,
      event: 'Liquid Level Changed',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      details: 'Level increased from 60% to 65%'
    }, {
      id: 5,
      event: 'System Check',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      details: 'All sensors operational'
    }],
    disposalHistory: [{
      id: 1,
      date: new Date(Date.now() - 604800000).toISOString(),
      type: 'Liquid waste',
      amount: '45L'
    }, {
      id: 2,
      date: new Date(Date.now() - 1209600000).toISOString(),
      type: 'Solid waste',
      amount: '28kg'
    }],
    nextScheduledDisposal: new Date(Date.now() + 259200000).toISOString(),
    usageStats: {
      dailyAverage: 24,
      weeklyTotal: 168,
      peakHours: [8, 12, 17]
    },
    maintenanceStatus: {
      lastService: new Date(Date.now() - 2592000000).toISOString(),
      nextService: new Date(Date.now() + 2592000000).toISOString(),
      components: [{
        name: 'Filter',
        status: 'Good'
      }, {
        name: 'Pump',
        status: 'Good'
      }, {
        name: 'Sensors',
        status: 'Needs attention'
      }]
    },
    historicalData: {
      liquidLevels: [{
        date: new Date(Date.now() - 604800000).toISOString(),
        value: 30
      }, {
        date: new Date(Date.now() - 518400000).toISOString(),
        value: 42
      }, {
        date: new Date(Date.now() - 432000000).toISOString(),
        value: 55
      }, {
        date: new Date(Date.now() - 345600000).toISOString(),
        value: 38
      }, {
        date: new Date(Date.now() - 259200000).toISOString(),
        value: 45
      }, {
        date: new Date(Date.now() - 172800000).toISOString(),
        value: 60
      }, {
        date: new Date(Date.now() - 86400000).toISOString(),
        value: 65
      }],
      solidLevels: [{
        date: new Date(Date.now() - 604800000).toISOString(),
        value: 15
      }, {
        date: new Date(Date.now() - 518400000).toISOString(),
        value: 20
      }, {
        date: new Date(Date.now() - 432000000).toISOString(),
        value: 25
      }, {
        date: new Date(Date.now() - 345600000).toISOString(),
        value: 30
      }, {
        date: new Date(Date.now() - 259200000).toISOString(),
        value: 32
      }, {
        date: new Date(Date.now() - 172800000).toISOString(),
        value: 38
      }, {
        date: new Date(Date.now() - 86400000).toISOString(),
        value: 42
      }],
      usageCounts: [{
        date: new Date(Date.now() - 604800000).toISOString(),
        value: 18
      }, {
        date: new Date(Date.now() - 518400000).toISOString(),
        value: 24
      }, {
        date: new Date(Date.now() - 432000000).toISOString(),
        value: 22
      }, {
        date: new Date(Date.now() - 345600000).toISOString(),
        value: 25
      }, {
        date: new Date(Date.now() - 259200000).toISOString(),
        value: 30
      }, {
        date: new Date(Date.now() - 172800000).toISOString(),
        value: 28
      }, {
        date: new Date(Date.now() - 86400000).toISOString(),
        value: 21
      }]
    }
  });
  // For toast notifications
  const [toastNotification, setToastNotification] = useState(null);
  // Connection status to the Pico (true = live data, false = mock fallback)
  const [picoConnected, setPicoConnected] = useState(false);
  // Mock fallback used when the Pico is unreachable so the demo keeps moving.
  const simulateData = () => {
    setToiletData(prevData => {
      const newLiquidLevel = Math.min(100, Math.max(0, prevData.liquidLevel + (Math.random() * 10 - 5)));
      const newSolidLevel = Math.min(100, Math.max(0, prevData.solidLevel + (Math.random() * 8 - 4)));
      const newMotionDetected = Math.random() > 0.3;
      const newRelayStatus = Math.random() > 0.7;
      const newBatteryLevel = Math.max(0, prevData.batteryLevel - 0.01);
      let newUsageCount = prevData.totalUsageCount;
      if (newMotionDetected && !prevData.motionDetected) {
        newUsageCount += 1;
        const newLog = {
          id: Date.now(),
          event: 'Motion Detected',
          timestamp: new Date().toISOString(),
          details: 'PIR sensor activated'
        };
        return {
          ...prevData,
          liquidLevel: newLiquidLevel,
          solidLevel: newSolidLevel,
          motionDetected: newMotionDetected,
          relayStatus: newRelayStatus,
          batteryLevel: newBatteryLevel,
          totalUsageCount: newUsageCount,
          systemLogs: [newLog, ...prevData.systemLogs.slice(0, 19)]
        };
      }
      if (newLiquidLevel > 90 && prevData.liquidLevel <= 90) {
        setToastNotification({
          type: 'warning',
          message: 'Warning: Liquid tank is nearly full (>90%)',
          id: Date.now()
        });
        setTimeout(() => {
          setToastNotification(null);
        }, 3000);
      }
      return {
        ...prevData,
        liquidLevel: newLiquidLevel,
        solidLevel: newSolidLevel,
        motionDetected: newMotionDetected,
        relayStatus: newRelayStatus,
        batteryLevel: newBatteryLevel,
        totalUsageCount: newUsageCount
      };
    });
  };
  // Merge live core fields from the Pico into existing state, logging notable
  // transitions and warning when the liquid tank gets full.
  const applyPicoStatus = (status: Awaited<ReturnType<typeof fetchStatus>>) => {
    setToiletData(prevData => {
      const logs = [...prevData.systemLogs];
      const addLog = (event: string, details: string) => {
        logs.unshift({
          id: Date.now() + Math.random(),
          event,
          timestamp: new Date().toISOString(),
          details
        });
      };
      if (status.motionDetected && !prevData.motionDetected) {
        addLog('Motion Detected', 'PIR sensor activated');
      }
      if (status.relayStatus !== prevData.relayStatus) {
        addLog(
          status.relayStatus ? 'Waste Gate Opened' : 'Waste Gate Closed',
          'Reported by Pico'
        );
      }
      if (status.liquidLevel > 90 && prevData.liquidLevel <= 90) {
        setToastNotification({
          type: 'warning',
          message: 'Warning: Liquid tank is nearly full (>90%)',
          id: Date.now()
        });
        setTimeout(() => setToastNotification(null), 3000);
      }
      return {
        ...prevData,
        liquidLevel: status.liquidLevel,
        solidLevel: status.solidLevel,
        motionDetected: status.motionDetected,
        relayStatus: status.relayStatus,
        batteryLevel: status.batteryLevel,
        totalUsageCount: status.totalUsageCount,
        systemLogs: logs.slice(0, 20)
      };
    });
  };
  // Poll the Pico for live data, falling back to the simulator when offline.
  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const status = await fetchStatus();
        if (cancelled) return;
        applyPicoStatus(status);
        setPicoConnected(true);
      } catch {
        if (cancelled) return;
        setPicoConnected(false);
        simulateData();
      }
    };
    poll();
    const interval = setInterval(poll, 2000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);
  // Function to toggle the relay status manually
  const toggleRelay = () => {
    setToiletData(prevData => {
      const nextRelayStatus = !prevData.relayStatus;
      // Notify the Pico of the manual toggle (fire-and-forget).
      sendCommand('relay', nextRelayStatus);
      // Create a new log entry for the manual relay toggle
      const newLog = {
        id: Date.now(),
        event: nextRelayStatus ? 'Waste Gate Opened' : 'Waste Gate Closed',
        timestamp: new Date().toISOString(),
        details: 'Manual control activated'
      };
      return {
        ...prevData,
        relayStatus: nextRelayStatus,
        systemLogs: [newLog, ...prevData.systemLogs.slice(0, 19)] // Keep last 20 logs
      };
    });
  };
  return <div className="min-h-screen bg-gray-100">
      <Dashboard data={toiletData} toastNotification={toastNotification} onToggleRelay={toggleRelay} picoConnected={picoConnected} />
    </div>;
}