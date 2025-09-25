import React from 'react';
import { useQuery } from 'react-query';
import { MapPin, Sprout, TrendingUp, Package, AlertTriangle } from 'lucide-react';
import { analyticsAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const StatCard = ({ title, value, icon: Icon, color, change }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {change && (
          <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '+' : ''}{change}% from last month
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { data: analytics, isLoading } = useQuery(
    'dashboard-analytics',
    analyticsAPI.getDashboardAnalytics,
    {
      select: (response) => response.data.analytics,
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const summary = analytics?.summary || {};
  const recentCrops = analytics?.recentCrops || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your agricultural operations.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Farms"
          value={summary.farmCount || 0}
          icon={MapPin}
          color="bg-blue-500"
          change={5}
        />
        <StatCard
          title="Total Crops"
          value={summary.cropCount || 0}
          icon={Sprout}
          color="bg-green-500"
          change={12}
        />
        <StatCard
          title="Active Crops"
          value={summary.activeCropCount || 0}
          icon={TrendingUp}
          color="bg-purple-500"
          change={-2}
        />
        <StatCard
          title="Farm Area"
          value={`${summary.totalFarmArea || 0} acres`}
          icon={Package}
          color="bg-orange-500"
          change={8}
        />
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Crops */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Crops</h2>
          </div>
          <div className="p-6">
            {recentCrops.length > 0 ? (
              <div className="space-y-4">
                {recentCrops.slice(0, 5).map((crop) => (
                  <div key={crop._id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{crop.name}</p>
                        <p className="text-xs text-gray-500">{crop.farm?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        crop.status === 'active' ? 'bg-green-100 text-green-800' :
                        crop.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {crop.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Sprout className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No crops planted yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                <MapPin className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-600">Add Farm</span>
              </button>
              <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                <Sprout className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-600">Plant Crop</span>
              </button>
              <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                <Package className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-600">Add Inventory</span>
              </button>
              <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                <TrendingUp className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-600">View Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Weather and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Widget */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weather Overview</h2>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">25°C</p>
                <p className="text-blue-100">Partly Cloudy</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100">Humidity: 65%</p>
                <p className="text-sm text-blue-100">Wind: 15 km/h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Alerts</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Low Inventory</p>
                <p className="text-xs text-yellow-600">Fertilizer running low</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">Harvest Ready</p>
                <p className="text-xs text-blue-600">Tomatoes ready to harvest</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;