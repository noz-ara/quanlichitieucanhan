import axios from 'axios';

// const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
// const csrfHeader = document.querySelector('meta[name="_csrf"]').getAttribute('content');

// Send CSRF tokens with requests
// axios.defaults.headers.common[csrfHeader] = csrfToken;
// axios.defaults.headers.common['X-XSRF-TOKEN'] = csrfToken;
axios.defaults.withCredentials = true; // Ensure credentials are sent

const API_URL = 'http://localhost:8080/expenses';

class ExpenseService {
  // Function to add a new expense
  static async addExpense(expenseData) {
    try {
          const response = await axios.post(API_URL, expenseData);
          return response.data;
      } catch (error) {
          if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.error('Error response:', error.response.data);
              throw new Error(error.response.data.message || 'Failed to add expense'); // Assuming server sends 'message' field in error response
          } else if (error.request) {
              // The request was made but no response was received
              console.error('No response received:', error.request);
              throw new Error('No response received from server');
          } else {
              // Something happened in setting up the request that triggered an Error
              console.error('Error setting up the request:', error.message);
              throw new Error('Failed to set up request');
          }
      }
  }

  // Function to fetch user's expenses (new secure endpoint)
  static async getMyExpenses() {
    try {
          const response = await axios.get(`${API_URL}/my`);
          return response.data;
      } catch (error) {
          console.error('Error fetching user expenses:', error.message);
          throw error;
      }
  }

  // Function to fetch all expenses (admin only - should be secured)
  static async getAllExpenses() {
    try {
          const response = await axios.get(API_URL);
          return response.data;
      } catch (error) {
          console.error('Error fetching all expenses:', error.message);
          throw error;
      }
  }

  // Function to fetch user expenses by category
  static async getMyExpensesByCategory(category) {
    try {
          const response = await axios.get(`${API_URL}/my/category/${category}`);
          return response.data;
      } catch (error) {
          console.error('Error fetching expenses by category:', error.message);
          throw error;
      }
  }

  // Function to fetch user expenses by type
  static async getMyExpensesByType(expenseType) {
    try {
          const response = await axios.get(`${API_URL}/my/type/${expenseType}`);
          return response.data;
      } catch (error) {
          console.error('Error fetching expenses by type:', error.message);
          throw error;
      }
  }

  // Function to fetch user expenses by date range
  static async getMyExpensesByDateRange(startDate, endDate) {
    try {
          const response = await axios.get(`${API_URL}/my/date-range`, {
            params: { startDate, endDate }
          });
          return response.data;
      } catch (error) {
          console.error('Error fetching expenses by date range:', error.message);
          throw error;
      }
  }

  // Function to get user expense count
  static async getMyExpenseCount() {
    try {
          const response = await axios.get(`${API_URL}/my/count`);
          return response.data;
      } catch (error) {
          console.error('Error fetching expense count:', error.message);
          throw error;
      }
  }

  // Function to update an expense by ID
  static async updateExpense(id, expenseData) {
    try {
          const response = await axios.put(`${API_URL}/${id}`, expenseData);
          return response.data;
      } catch (error) {
          if (error.response) {
              console.error('Error response:', error.response.data);
              throw new Error(error.response.data.message || 'Failed to update expense');
          } else if (error.request) {
              console.error('No response received:', error.request);
              throw new Error('No response received from server');
          } else {
              console.error('Error setting up the request:', error.message);
              throw new Error('Failed to set up request');
          }
      }
  }

  // Function to delete an expense by ID
  static async deleteExpense(id) {
    try {
          const response = await axios.delete(`${API_URL}/${id}`);
          return response.data;
      } catch (error) {
          if (error.response) {
              console.error('Error response:', error.response.data);
              throw new Error(error.response.data.message || 'Failed to delete expense');
          } else if (error.request) {
              console.error('No response received:', error.request);
              throw new Error('No response received from server');
          } else {
              console.error('Error setting up the request:', error.message);
              throw new Error('Failed to set up request');
          }
      }
  }
}

export default ExpenseService;
