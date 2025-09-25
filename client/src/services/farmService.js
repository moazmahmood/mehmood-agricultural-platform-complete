import api from './api';

class FarmService {
  async getFarms(params = {}) {
    const response = await api.get('/farms', { params });
    return response.data;
  }

  async getFarm(id) {
    const response = await api.get(`/farms/${id}`);
    return response.data;
  }

  async createFarm(farmData) {
    const response = await api.post('/farms', farmData);
    return response.data;
  }

  async updateFarm(id, farmData) {
    const response = await api.put(`/farms/${id}`, farmData);
    return response.data;
  }

  async deleteFarm(id) {
    const response = await api.delete(`/farms/${id}`);
    return response.data;
  }

  async addField(farmId, fieldData) {
    const response = await api.post(`/farms/${farmId}/fields`, fieldData);
    return response.data;
  }

  async updateField(farmId, fieldId, fieldData) {
    const response = await api.put(`/farms/${farmId}/fields/${fieldId}`, fieldData);
    return response.data;
  }
}

export const farmService = new FarmService();