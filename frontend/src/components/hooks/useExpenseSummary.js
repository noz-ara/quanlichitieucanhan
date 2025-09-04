import { useState, useEffect } from "react";
import ExpenseService from "../service/ExpenseService";

const useExpenseSummary = () => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({
    totalTillToday: 0,
    totalThisMonth: 0,
    totalThisYear: 0,
  });

  const fetchExpenses = async () => {
    try {
      const fetchedExpenses = await ExpenseService.getMyExpenses();
      setExpenses(fetchedExpenses);
    } catch (error) {
      console.error("Error fetching expenses:", error.message);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const totalTillToday = expenses.reduce((total, e) => {
      const d = new Date(e.date);
      return d <= today ? total + parseFloat(e.amount) : total;
    }, 0);

    const totalThisMonth = expenses.reduce((total, e) => {
      const d = new Date(e.date);
      return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear
        ? total + parseFloat(e.amount)
        : total;
    }, 0);

    const totalThisYear = expenses.reduce((total, e) => {
      const d = new Date(e.date);
      return d.getFullYear() === currentYear
        ? total + parseFloat(e.amount)
        : total;
    }, 0);

    setSummary({
      totalTillToday: totalTillToday.toFixed(2),
      totalThisMonth: totalThisMonth.toFixed(2),
      totalThisYear: totalThisYear.toFixed(2),
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
    sortExpensesByDateLatest,
    sortExpensesByDateOldest,
    sortExpensesByAmountMax,
    sortExpensesByAmountMin,
  };
};

export { useExpenseSummary };
