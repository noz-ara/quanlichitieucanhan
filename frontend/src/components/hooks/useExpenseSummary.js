import { useState, useEffect } from "react";
import ExpenseService from "../service/ExpenseService";

const useExpenseSummary = () => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({
    totalTillToday: 0,
    totalThisMonth: 0,
    totalThisYear: 0,
    averagePerDay: 0,
    forecastEndOfMonth: 0,
    grouped: { ESSENTIAL: 0, WANTS: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const fetchedExpenses = await ExpenseService.getMyExpenses();
      setExpenses(fetchedExpenses || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching expenses:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    if (!expenses.length) {
      setSummary((prev) => ({ ...prev, totalTillToday: 0, totalThisMonth: 0, totalThisYear: 0 }));
      return;
    }

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dayOfMonth = today.getDate();

    let grouped = { ESSENTIAL: 0, WANTS: 0 };
    const totalTillToday = expenses.reduce((total, e) => {
      const d = new Date(e.date);
      if (d <= today) total += parseFloat(e.amount);
      return total;
    }, 0);

    const totalThisMonth = expenses.reduce((total, e) => {
      const d = new Date(e.date);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        total += parseFloat(e.amount);
        if (e.budgetGroup && grouped[e.budgetGroup] !== undefined) {
          grouped[e.budgetGroup] += parseFloat(e.amount);
        }
      }
      return total;
    }, 0);

    const totalThisYear = expenses.reduce((total, e) => {
      const d = new Date(e.date);
      return d.getFullYear() === currentYear ? total + parseFloat(e.amount) : total;
    }, 0);

    // Trung bình mỗi ngày & dự báo cuối tháng
    const averagePerDay = dayOfMonth > 0 ? totalThisMonth / dayOfMonth : 0;
    const forecastEndOfMonth = averagePerDay * daysInMonth;

    setSummary({
      totalTillToday,
      totalThisMonth,
      totalThisYear,
      averagePerDay,
      forecastEndOfMonth,
      grouped,
    });
  }, [expenses]);

  const sortExpensesByDateLatest = () =>
    expenses.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

  const sortExpensesByDateOldest = () =>
    expenses.slice().sort((a, b) => new Date(a.date) - new Date(b.date));

  const sortExpensesByAmountMax = () =>
    expenses.slice().sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));

  const sortExpensesByAmountMin = () =>
    expenses.slice().sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));

  return {
    expenses,
    fetchExpenses,
    summary,
    loading,
    error,
    sortExpensesByDateLatest,
    sortExpensesByDateOldest,
    sortExpensesByAmountMax,
    sortExpensesByAmountMin,
  };
};

export { useExpenseSummary };
