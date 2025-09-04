import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { styled } from 'styled-components';
import { format } from 'date-fns';

const StyledBox = styled.div`
    width: 100%;
    height: 400px; /* Set a fixed height or adjust as needed */
    background-color: var(--color-grey-0);
    padding: 3.2rem 3.2rem 1.6rem 1.6rem;
    grid-column: 1 / span 4;
    border-radius: var(--border-radius-md);
    overflow-x: auto;
`;

const LineChartComponent = ({ expenses, incomes = [] }) => {
    // Generate comparative line chart data from expenses and incomes
    const generateLineChartData = (expensesList, incomesList) => {
        const grouped = {};

        expensesList.forEach(item => {
            const dateKey = format(new Date(item.date), 'dd-MMM');
            if (!grouped[dateKey]) grouped[dateKey] = { name: dateKey, expenses: 0, incomes: 0 };
            grouped[dateKey].expenses += parseFloat(item.amount);
        });

        incomesList.forEach(item => {
            const dateKey = format(new Date(item.date), 'dd-MMM');
            if (!grouped[dateKey]) grouped[dateKey] = { name: dateKey, expenses: 0, incomes: 0 };
            grouped[dateKey].incomes += parseFloat(item.amount);
        });

        // Sort by date order using a parse back approach
        const data = Object.values(grouped).sort((a, b) => {
            const parse = (label) => new Date(label);
            return parse(a.name) - parse(b.name);
        });

        return data;
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
