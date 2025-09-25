import React from 'react';
import { useParams } from 'react-router-dom';
import { Wheat } from 'lucide-react';

const CropDetail = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Crop Details</h1>
      </div>

      <div className="card">
        <div className="card-body text-center py-12">
          <Wheat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Crop Detail View</h3>
          <p className="text-gray-600 mb-4">
            Detailed crop information for crop ID: {id}
          </p>
          <p className="text-sm text-gray-500">
            This page will show comprehensive crop details including growth stages,
            treatments applied, monitoring data, and yield analytics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CropDetail;