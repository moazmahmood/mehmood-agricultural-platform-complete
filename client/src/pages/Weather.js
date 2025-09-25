import React from 'react';
import { Cloud } from 'lucide-react';

const Weather = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Weather</h1>
        <p className="text-gray-600">Monitor weather conditions for your farms</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <Cloud className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Weather information</h3>
        <p className="text-gray-500">Weather data will be displayed here once farms are added.</p>
      </div>
    </div>
  );
};

export default Weather;