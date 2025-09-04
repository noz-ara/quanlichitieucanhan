import api from "./api";

const BASE_URL = "/api/income";

class IncomeService {
  static async addIncome(incomeData) {
    const res = await api.post(BASE_URL, incomeData);
    return res.data;
  }

  static async getMyIncomes() {
    const res = await api.get(`${BASE_URL}/my`);
    return res.data;
  }

  static async getAllIncomes() {
    const res = await api.get(BASE_URL);
    return res.data;
  }

  static async getMyIncomesByType(incomeType) {
    const res = await api.get(`${BASE_URL}/my/type/${incomeType}`);
    return res.data;
  }

  static async getMyIncomesByDateRange(startDate, endDate) {
    const res = await api.get(`${BASE_URL}/my/date-range`, {
      params: { startDate, endDate },
    });
    return res.data;
  }

  static async getMyIncomeCount() {
    const res = await api.get(`${BASE_URL}/my/count`);
    return res.data;
  }

  static async updateIncome(id, incomeData) {
    const res = await api.put(`${BASE_URL}/${id}`, incomeData);
    return res.data;
  }

  static async deleteIncome(id) {
    const res = await api.delete(`${BASE_URL}/${id}`);
    return res.data;
  }
}

export default IncomeService;
