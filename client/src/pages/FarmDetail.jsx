import React from 'react';
import { useParams } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const FarmDetail = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Farm Details</h1>
      </div>

      <div className="card">
        <div className="card-body text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Farm Detail View</h3>
          <p className="text-gray-600 mb-4">
            Detailed farm information for farm ID: {id}
          </p>
          <p className="text-sm text-gray-500">
            This page will show comprehensive farm details including location,
            fields, crops, weather data, and management tools.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FarmDetail;