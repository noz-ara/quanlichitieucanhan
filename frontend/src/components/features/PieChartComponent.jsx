import React, { useMemo } from 'react';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';
import styled from 'styled-components';
import Heading from '../ui/Heading';

const StyledBox = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background-color: var(--color-grey-0);
  padding: 0 0 1.6rem 0;
  grid-column: 3 / span 2;
  border-radius: var(--border-radius-md);
  position: relative;
`;

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
  '#AF19FF', '#FF1967', '#FF6B19', '#9CFF19',
  '#1971FF', '#FF19E6', '#19FF71', '#19FFBE',
  '#FF1971', '#19FF9E', '#7119FF', '#FF7119'
];

const PieChartComponent = ({ data = [], title, gridColumn }) => {
  const chartData = useMemo(() => {
    const categoryMap = {};
    data.forEach((item) => {
      const { category, amount } = item; // Sử dụng 'amount' thay vì 'value'
      categoryMap[category] = (categoryMap[category] || 0) + parseFloat(amount);
    });
    return Object.keys(categoryMap).map((category, index) => ({
      name: category,
      value: categoryMap[category],
      color: COLORS[index % COLORS.length],
    }));
  }, [data]);

  return (
    <StyledBox style={gridColumn ? { gridColumn } : undefined}>
      {title && (
        <div style={{ position: 'absolute', top: '0.8rem', left: '1rem' }}>
          <Heading as="h3">{title}</Heading>
        </div>
      )}
      {chartData.length === 0 ? (
        <p style={{ padding: '2rem' }}>Không có dữ liệu để hiển thị</p>
      ) : (
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            data={chartData}
            cx={200}
            cy={200}
            outerRadius={80}
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      )}
    </StyledBox>
  );
};

export default PieChartComponent;
