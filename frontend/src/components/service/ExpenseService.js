import api from "./api"; // dùng instance axios chung

const BASE_URL = "/api/expenses";

class ExpenseService {
  static async addExpense(expenseData) {
    const res = await api.post(BASE_URL, expenseData);
    return res.data;
  }

  static async getMyExpenses() {
    const res = await api.get(`${BASE_URL}/my`);
    return res.data;
  }

  static async getAllExpenses() {
    const res = await api.get(BASE_URL);
    return res.data;
  }

  static async getMyExpensesByCategory(category) {
    const res = await api.get(`${BASE_URL}/my/category/${category}`);
    return res.data;
  }

  static async getMyExpensesByType(expenseType) {
    const res = await api.get(`${BASE_URL}/my/type/${expenseType}`);
    return res.data;
  }

  static async getMyExpensesByDateRange(startDate, endDate) {
    const res = await api.get(`${BASE_URL}/my/date-range`, {
      params: { startDate, endDate },
    });
    return res.data;
  }

  static async getMyExpenseCount() {
    const res = await api.get(`${BASE_URL}/my/count`);
    return res.data;
  }

  static async updateExpense(id, expenseData) {
    const res = await api.put(`${BASE_URL}/${id}`, expenseData);
    return res.data;
  }

  static async deleteExpense(id) {
    const res = await api.delete(`${BASE_URL}/${id}`);
    return res.data;
  }
}

export default ExpenseService;
