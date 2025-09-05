import { useState, useEffect } from "react";
import IncomeService from "../service/IncomeService";

const useIncomeSummary = () => {
  const [incomes, setIncomes] = useState([]);
  const [summary, setSummary] = useState({
    totalTillToday: 0,
    totalThisMonth: 0,
    totalThisYear: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchIncomes = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedIncomes = await IncomeService.getMyIncomes();
      setIncomes(Array.isArray(fetchedIncomes) ? fetchedIncomes : []);
    } catch (err) {
      setError(err.message || "Error fetching incomes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  useEffect(() => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    let totalTillToday = 0;
    let totalThisMonth = 0;
    let totalThisYear = 0;

    incomes.forEach((income) => {
      const d = new Date(income.date);
      const amount = Number(income.amount) || 0;

      if (d <= today) totalTillToday += amount;
      if (d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear)
        totalThisMonth += amount;
      if (d.getFullYear() === currentYear) totalThisYear += amount;
    });

    setSummary({
      totalTillToday,
      totalThisMonth,
      totalThisYear,
    });
  }, [incomes]);

  const sortIncomesByDateLatest = () =>
    incomes.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

  const sortIncomesByDateOldest = () =>
    incomes.slice().sort((a, b) => new Date(a.date) - new Date(b.date));

  const sortIncomesByAmountMax = () =>
    incomes.slice().sort((a, b) => Number(b.amount) - Number(a.amount));

  const sortIncomesByAmountMin = () =>
    incomes.slice().sort((a, b) => Number(a.amount) - Number(b.amount));

  return {
    incomes,
    summary,
    loading,
    error,
    fetchIncomes,
    sortIncomesByDateLatest,
    sortIncomesByDateOldest,
    sortIncomesByAmountMax,
    sortIncomesByAmountMin,
  };
};

export { useIncomeSummary };
