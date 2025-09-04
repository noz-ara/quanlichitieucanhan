import { useState, useEffect } from "react";
import IncomeService from "../service/IncomeService";

const useIncomeSummary = () => {
  const [incomes, setIncomes] = useState([]);
  const [summary, setSummary] = useState({
    totalTillToday: 0,
    totalThisMonth: 0,
    totalThisYear: 0,
  });

  const fetchIncomes = async () => {
    try {
      const fetchedIncomes = await IncomeService.getMyIncomes(); // ✅ đúng hàm
      setIncomes(Array.isArray(fetchedIncomes) ? fetchedIncomes : []);
    } catch (error) {
      console.error("Error fetching incomes:", error.message);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  useEffect(() => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const totalTillToday = incomes.reduce((total, income) => {
      const d = new Date(income.date);
      return d <= today ? total + parseFloat(income.amount || 0) : total;
    }, 0);

    const totalThisMonth = incomes.reduce((total, income) => {
      const d = new Date(income.date);
      return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear
        ? total + parseFloat(income.amount || 0)
        : total;
    }, 0);

    const totalThisYear = incomes.reduce((total, income) => {
      const d = new Date(income.date);
      return d.getFullYear() === currentYear
        ? total + parseFloat(income.amount || 0)
        : total;
    }, 0);

    setSummary({
      totalTillToday: totalTillToday.toFixed(2),
      totalThisMonth: totalThisMonth.toFixed(2),
      totalThisYear: totalThisYear.toFixed(2),
    });
  }, [incomes]);

  const sortIncomesByDateLatest = () =>
    incomes.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

  const sortIncomesByDateOldest = () =>
    incomes.slice().sort((a, b) => new Date(a.date) - new Date(b.date));

  const sortIncomesByAmountMax = () =>
    incomes.slice().sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));

  const sortIncomesByAmountMin = () =>
    incomes.slice().sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));

  return {
    incomes,
    summary,
    fetchIncomes,
    sortIncomesByDateLatest,
    sortIncomesByDateOldest,
    sortIncomesByAmountMax,
    sortIncomesByAmountMin,
  };
};

export { useIncomeSummary };
