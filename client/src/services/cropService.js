import api from './api';

class CropService {
  async getCrops(params = {}) {
    const response = await api.get('/crops', { params });
    return response.data;
  }

  async getCrop(id) {
    const response = await api.get(`/crops/${id}`);
    return response.data;
  }

  async createCrop(cropData) {
    const response = await api.post('/crops', cropData);
    return response.data;
  }

  async updateCrop(id, cropData) {
    const response = await api.put(`/crops/${id}`, cropData);
    return response.data;
  }

  async deleteCrop(id) {
    const response = await api.delete(`/crops/${id}`);
    return response.data;
  }

  async addMonitoring(cropId, monitoringData) {
    const response = await api.post(`/crops/${cropId}/monitoring`, monitoringData);
    return response.data;
  }

  async addTreatment(cropId, treatmentData) {
    const response = await api.post(`/crops/${cropId}/treatments`, treatmentData);
    return response.data;
  }

  async getCropAnalytics() {
    const response = await api.get('/crops/analytics');
    return response.data;
  }
}

export const cropService = new CropService();