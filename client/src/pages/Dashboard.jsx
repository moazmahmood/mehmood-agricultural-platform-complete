import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Wheat, 
  Cloud, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  DollarSign,
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { farmService } from '../services/farmService';
import { cropService } from '../services/cropService';
import { weatherService } from '../services/weatherService';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();

  const { data: farms, isLoading: farmsLoading } = useQuery(
    'farms',
    () => farmService.getFarms({ limit: 5 }),
    { staleTime: 300000 }
  );

  const { data: crops, isLoading: cropsLoading } = useQuery(
    'crops',
    () => cropService.getCrops({ limit: 5 }),
    { staleTime: 300000 }
  );

  const { data: analytics, isLoading: analyticsLoading } = useQuery(
    'crop-analytics',
    () => cropService.getCropAnalytics(),
    { staleTime: 300000 }
  );

  const { data: weatherAlerts, isLoading: weatherLoading } = useQuery(
    'weather-alerts',
    () => weatherService.getWeatherAlerts(),
    { 
      staleTime: 300000,
      retry: 1,
      onError: (error) => {
        console.log('Weather service unavailable:', error);
      }
    }
  );

  const stats = [
    {
      name: 'Total Farms',
      value: farms?.totalFarms || 0,
      icon: MapPin,
      color: 'bg-blue-500',
      href: '/farms'
    },
    {
      name: 'Active Crops',
      value: analytics?.analytics?.activeCrops || 0,
      icon: Wheat,
      color: 'bg-green-500',
      href: '/crops'
    },
    {
      name: 'Total Investment',
      value: `$${(analytics?.analytics?.totalInvestment || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      href: '/crops'
    },
    {
      name: 'Weather Alerts',
      value: weatherAlerts?.alerts?.length || 0,
      icon: AlertTriangle,
      color: 'bg-red-500',
      href: '/weather'
    }
  ];

  if (farmsLoading && cropsLoading && analyticsLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-green-100">
          Here's an overview of your agricultural operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              to={stat.href}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="card-body">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Weather Alerts */}
      {weatherAlerts && weatherAlerts.alerts && weatherAlerts.alerts.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Weather Alerts
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {weatherAlerts.alerts.slice(0, 3).map((alert, index) => (
                <div key={index} className="border-l-4 border-red-400 bg-red-50 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-red-800">{alert.farmName}</h4>
                      <p className="text-sm text-red-700">
                        {alert.weather.conditions} - {alert.weather.temperature}°C
                      </p>
                    </div>
                    <span className="text-xs text-red-600">
                      {alert.alerts.length} alert{alert.alerts.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="mt-2">
                    {alert.alerts.slice(0, 2).map((alertItem, idx) => (
                      <p key={idx} className="text-sm text-red-700">
                        • {alertItem.message}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link to="/weather" className="btn btn-outline">
                View All Alerts
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Farms */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium flex items-center">
              <MapPin className="h-5 w-5 text-blue-500 mr-2" />
              Recent Farms
            </h3>
          </div>
          <div className="card-body">
            {farmsLoading ? (
              <LoadingSpinner size="small" />
            ) : farms && farms.farms && farms.farms.length > 0 ? (
              <div className="space-y-4">
                {farms.farms.map((farm) => (
                  <Link
                    key={farm._id}
                    to={`/farms/${farm._id}`}
                    className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{farm.name}</h4>
                        <p className="text-sm text-gray-600">{farm.location.address}</p>
                        <p className="text-xs text-gray-500">
                          {farm.size.value} {farm.size.unit}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {farm.fields?.length || 0} fields
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No farms yet</p>
                <Link to="/farms" className="btn btn-primary mt-2">
                  Add Your First Farm
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Crops */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium flex items-center">
              <Wheat className="h-5 w-5 text-green-500 mr-2" />
              Recent Crops
            </h3>
          </div>
          <div className="card-body">
            {cropsLoading ? (
              <LoadingSpinner size="small" />
            ) : crops && crops.crops && crops.crops.length > 0 ? (
              <div className="space-y-4">
                {crops.crops.map((crop) => (
                  <Link
                    key={crop._id}
                    to={`/crops/${crop._id}`}
                    className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{crop.name}</h4>
                        <p className="text-sm text-gray-600">{crop.variety}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          {crop.growthStage} • {crop.area.value} {crop.area.unit}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        crop.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : crop.status === 'harvested'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {crop.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Wheat className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No crops yet</p>
                <Link to="/crops" className="btn btn-primary mt-2">
                  Add Your First Crop
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium">Quick Actions</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/farms" className="btn btn-outline">
              <MapPin className="h-4 w-4" />
              Manage Farms
            </Link>
            <Link to="/crops" className="btn btn-outline">
              <Wheat className="h-4 w-4" />
              Track Crops
            </Link>
            <Link to="/weather" className="btn btn-outline">
              <Cloud className="h-4 w-4" />
              Check Weather
            </Link>
            <Link to="/profile" className="btn btn-outline">
              <Activity className="h-4 w-4" />
              Update Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;