import { useMemo } from "react";

// danh sách tháng (viết tắt)
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
                "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Gom data chart từ expenses
 * @param {Array} expenses - mảng chi tiêu [{amount, date, category}, ...]
 */
export default function useChartData(expenses = []) {
  // Pie chart: chi tiêu theo danh mục
  const pieData = useMemo(() => {
    const categoryMap = {};
    expenses.forEach(({ category, amount }) => {
      categoryMap[category] = (categoryMap[category] || 0) + parseFloat(amount);
    });

    return Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount,
    }));
  }, [expenses]);

  // Line chart: chi tiêu theo tháng trong năm hiện tại
  const lineData = useMemo(() => {
    const monthlyTotals = Array(12).fill(0);
    const currentYear = new Date().getFullYear();

    expenses.forEach(({ date, amount }) => {
      const d = new Date(date);
      if (d.getFullYear() === currentYear) {
        monthlyTotals[d.getMonth()] += parseFloat(amount);
      }
    });

    return MONTHS.map((name, i) => ({
      name,
      expenses: monthlyTotals[i],
    }));
  }, [expenses]);

  return { pieData, lineData };
}
