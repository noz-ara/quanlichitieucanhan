import React from 'react';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';
import ChartBox from '../ui/ChartBox';
import { calculateExpensesByCategory } from './ChartData';
import { styled } from 'styled-components';

const StyledBox = styled.div`
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    background-color: var(--color-grey-0);
    padding: 0 0 1.6rem 0;
    grid-column: 3 / span 2;
    border-radius: var(--border-radius-md);
`;

const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
    '#AF19FF', '#FF1967', '#FF6B19', '#9CFF19',
    '#1971FF', '#FF19E6', '#19FF71', '#19FFBE',
    '#FF1971', '#19FF9E', '#7119FF', '#FF7119'
];

const PieChartComponent = ({ expenses }) => {

    const calculateExpensesByCategory = () => {
        const categoryMap = {};
        const uniqueColors = {};

        expenses.forEach(expense => {
            const { category, amount } = expense;
            if (categoryMap[category]) {
                categoryMap[category] += parseFloat(amount);
            } else {
                categoryMap[category] = parseFloat(amount);
                // Assign a unique color from COLORS array based on category index
                uniqueColors[category] = COLORS[Object.keys(categoryMap).indexOf(category)];
            }
        });

        const data = Object.keys(categoryMap).map(category => ({
            name: category,  
            value: categoryMap[category], 
            color: uniqueColors[category],
        }));

        return data;
    };

    const data = calculateExpensesByCategory();

    return (
        <StyledBox>
            <PieChart width={400} height={400}>
                <Pie
                    dataKey="value"
                    data={data}
                    cx={200}
                    cy={200}
                    outerRadius={80}
                    fill="var(--color-brand-700)"
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </StyledBox>
    );
};

export default PieChartComponent;
