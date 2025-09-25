import React from 'react';
import { Package, Plus } from 'lucide-react';

const Inventory = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-600">Manage your agricultural supplies and equipment</p>
        </div>
        <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory items yet</h3>
        <p className="text-gray-500 mb-4">Start adding inventory items to track your supplies and equipment.</p>
        <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
          Add Your First Item
        </button>
      </div>
    </div>
  );
};

export default Inventory;