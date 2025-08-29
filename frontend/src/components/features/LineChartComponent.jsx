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

const LineChartComponent = ({ expenses }) => {
    // Function to generate line chart data from expenses
    const generateLineChartData = (expenses) => {
        const groupedByDate = {};

        // Group expenses by formatted date and calculate total amount for each date
        expenses.forEach(expense => {
            const dateKey = format(new Date(expense.date), 'dd-MMM'); // Format date as "30-Jun"
            if (!groupedByDate[dateKey]) {
                groupedByDate[dateKey] = 0;
            }
            groupedByDate[dateKey] += parseFloat(expense.amount);
        });

        // Prepare data array for recharts LineChart
        const data = Object.keys(groupedByDate).map(date => ({
            name: date,
            expenses: groupedByDate[date],
        }));

        return data;
    };

    // Generate data based on expenses
    const data = generateLineChartData(expenses);

    return (
        <StyledBox>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid stroke="var(--color-grey-300)" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="expenses" stroke="var(--color-brand-700)" />
                </LineChart>
            </ResponsiveContainer>
        </StyledBox>
    );
};

export default LineChartComponent;
