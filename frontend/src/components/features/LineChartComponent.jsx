import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styled from "styled-components";

const StyledBox = styled.div`
  width: 100%;
  height: 400px;
  background-color: var(--color-grey-0);
  padding: 3.2rem 3.2rem 1.6rem 1.6rem;
  grid-column: 1 / span 4;
  border-radius: var(--border-radius-md);
  overflow-x: auto;
`;

const LineChartComponent = ({ expenses = [], incomes = [] }) => {
  const generateLineChartData = (expensesList, incomesList) => {
    const grouped = {};

    expensesList.forEach((item) => {
      if (!item?.date) return;
      const d = new Date(item.date);
      const dateKey = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }); // ví dụ 01-Sep
      if (!grouped[dateKey]) grouped[dateKey] = { name: dateKey, expenses: 0, incomes: 0 };
      grouped[dateKey].expenses += parseFloat(item.amount) || 0;
    });

    incomesList.forEach((item) => {
      if (!item?.date) return;
      const d = new Date(item.date);
      const dateKey = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
      if (!grouped[dateKey]) grouped[dateKey] = { name: dateKey, expenses: 0, incomes: 0 };
      grouped[dateKey].incomes += parseFloat(item.amount) || 0;
    });

    // sort theo ngày thật
    return Object.values(grouped).sort(
      (a, b) => new Date(a.name + " 2025") - new Date(b.name + " 2025")
    );
  };

  const data = generateLineChartData(expenses, incomes);

  return (
    <StyledBox>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="var(--color-grey-300)" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="expenses" stroke="var(--color-brand-700)" name="Chi tiêu" />
          <Line type="monotone" dataKey="incomes" stroke="#00C49F" name="Thu nhập" />
        </LineChart>
      </ResponsiveContainer>
    </StyledBox>
  );
};

export default LineChartComponent;
