import { useMemo } from "react";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun",
                "Jul","Aug","Sep","Oct","Nov","Dec"];

export default function useChartData(expenses = [], incomes = []) {
  // Pie chart: chi tiêu theo danh mục
  const expensePie = useMemo(() => {
    const categoryMap = {};
    expenses.forEach(({ category, amount }) => {
      categoryMap[category] = (categoryMap[category] || 0) + parseFloat(amount);
    });
    return Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount,
    }));
  }, [expenses]);

  // Pie chart: thu nhập theo danh mục
  const incomePie = useMemo(() => {
    const categoryMap = {};
    incomes.forEach(({ category, amount }) => {
      categoryMap[category] = (categoryMap[category] || 0) + parseFloat(amount);
    });
    return Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount,
    }));
  }, [incomes]);

  // Line chart: chi tiêu + thu nhập theo tháng trong năm
  const lineData = useMemo(() => {
    const monthlyTotals = Array(12).fill(0).map(() => ({ expenses: 0, incomes: 0 }));
    const currentYear = new Date().getFullYear();

    expenses.forEach(({ date, amount }) => {
      const d = new Date(date);
      if (d.getFullYear() === currentYear) {
        monthlyTotals[d.getMonth()].expenses += parseFloat(amount);
      }
    });

    incomes.forEach(({ date, amount }) => {
      const d = new Date(date);
      if (d.getFullYear() === currentYear) {
        monthlyTotals[d.getMonth()].incomes += parseFloat(amount);
      }
    });

    return MONTHS.map((name, i) => ({
      name,
      expenses: monthlyTotals[i].expenses,
      incomes: monthlyTotals[i].incomes,
    }));
  }, [expenses, incomes]);

  return { expensePie, incomePie, lineData };
}
