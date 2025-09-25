import React from 'react';
import { MapPin, Plus } from 'lucide-react';

const Farms = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Farm Management</h1>
        <button className="btn btn-primary">
          <Plus className="h-4 w-4" />
          Add Farm
        </button>
      </div>

      <div className="card">
        <div className="card-body text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Farm Management</h3>
          <p className="text-gray-600 mb-4">
            Manage your farms, fields, and agricultural operations in one place.
          </p>
          <p className="text-sm text-gray-500">
            This feature will allow you to add, edit, and monitor your farms with geolocation,
            soil information, and field management capabilities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Farms;