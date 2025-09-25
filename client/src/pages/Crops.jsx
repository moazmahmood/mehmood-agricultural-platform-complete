import React from 'react';
import { Wheat, Plus } from 'lucide-react';

const Crops = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Crop Management</h1>
        <button className="btn btn-primary">
          <Plus className="h-4 w-4" />
          Add Crop
        </button>
      </div>

      <div className="card">
        <div className="card-body text-center py-12">
          <Wheat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Crop Tracking & Management</h3>
          <p className="text-gray-600 mb-4">
            Track your crops from planting to harvest with comprehensive monitoring tools.
          </p>
          <p className="text-sm text-gray-500">
            This feature includes crop lifecycle tracking, growth monitoring, treatment records,
            yield predictions, and financial analysis for each crop.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Crops;