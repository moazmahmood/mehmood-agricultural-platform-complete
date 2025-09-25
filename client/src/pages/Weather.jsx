import React from 'react';
import { Cloud, AlertTriangle } from 'lucide-react';

const Weather = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Weather & Alerts</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium flex items-center">
              <Cloud className="h-5 w-5 text-blue-500 mr-2" />
              Current Weather
            </h3>
          </div>
          <div className="card-body text-center py-8">
            <Cloud className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Real-time weather data for your farms with agricultural insights
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Weather Alerts
            </h3>
          </div>
          <div className="card-body text-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Agricultural weather alerts and recommendations for your crops
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body text-center py-12">
          <Cloud className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Weather Integration</h3>
          <p className="text-gray-600 mb-4">
            Advanced weather monitoring and agricultural recommendations.
          </p>
          <p className="text-sm text-gray-500">
            This feature integrates with weather APIs to provide current conditions,
            forecasts, and agricultural advice tailored to your crops and location.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Weather;