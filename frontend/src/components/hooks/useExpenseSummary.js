import { useState, useEffect } from 'react';
import ExpenseService from '../service/ExpenseService';
import { calculateExpensesByCategory, generateLineChartData } from '../features/ChartData';

const useExpenseSummary = () => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({
    totalTillToday: 0,
    totalThisMonth: 0,
    totalThisYear: 0,
  });

  const fetchExpenses = async () => {
    try {
      const fetchedExpenses = await ExpenseService.getAllExpenses();
      setExpenses(fetchedExpenses);
      console.log('fetchExpenses called!')
    } catch (error) {
      console.error('Error fetching expenses:', error.message);
    }
  };

  useEffect(()=>{
    fetchExpenses();
    return () => {
      // Cleanup logic (optional)
    }
  }
  ,[])

  useEffect(() => {
    const today = new Date();

    // Calculate total expenses till today
    const totalTillToday = expenses.reduce((total, expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate <= today ? total + parseFloat(expense.amount) : total;
    }, 0);

    // Calculate total expenses for the current month
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const totalThisMonth = expenses.reduce((total, expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() + 1 === currentMonth && expenseDate.getFullYear() === currentYear ?
        total + parseFloat(expense.amount) : total;
    }, 0);

    // Calculate total expenses for the current year
    const totalThisYear = expenses.reduce((total, expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getFullYear() === currentYear ? total + parseFloat(expense.amount) : total;
    }, 0);

    setSummary({
      totalTillToday: totalTillToday.toFixed(2),
      totalThisMonth: totalThisMonth.toFixed(2),
      totalThisYear: totalThisYear.toFixed(2),
    });

  }, [expenses]);

  const sortExpensesByDateLatest = () => {
    return expenses.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const sortExpensesByDateOldest = () => {
    return expenses.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const sortExpensesByAmountMax = () => {
    return expenses.slice().sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
  };

  const sortExpensesByAmountMin = () => {
    return expenses.slice().sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
  };

  const expensesByCategory = calculateExpensesByCategory; // Replace with actual logic
  const lineChartData = generateLineChartData; // Replace with actual logic

  return {
    expenses,
    fetchExpenses,
    summary,
    expensesByCategory,
    lineChartData,
    sortExpensesByDateLatest,
    sortExpensesByDateOldest,
    sortExpensesByAmountMax,
    sortExpensesByAmountMin,
  };
};

export { useExpenseSummary };
