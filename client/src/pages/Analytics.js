import React from 'react';
import { BarChart3 } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Analyze your agricultural performance and insights</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
        <p className="text-gray-500">Detailed analytics and reports will be available once you have data.</p>
      </div>
    </div>
  );
};

export default Analytics;