import React, { useState } from 'react';
import styled from "styled-components";
import Stats from '../features/Stats';
import ExpenseActivity from '../features/ExpenseActivity';
import IncomeActivity from '../features/IncomeActivity';
import LineChart from '../features/LineChartComponent';
import PieChart from '../features/PieChartComponent';
import ExpenseForm from '../expenses/ExpenseForm';
import { AiOutlinePlus } from 'react-icons/ai';
import ExpenseService from '../service/ExpenseService';
import IncomeService from '../service/IncomeService';
import { useExpenseSummary } from '../hooks/useExpenseSummary';

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 1.6rem;
  position: relative; 
`;

const AddButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: var(--color-brand-600);
  color: var(--color-grey-100);
  border: none;
  padding: 1.2rem;
  font-size: 2rem;
  font-weight: 500;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);

  &:hover {
    background-color: var(--color-brand-700);
  }

  @media (max-width: 768px) {
    right: 1rem;
    bottom: 1rem;
  }
`;

function DashboardLayout() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { expenses, fetchExpenses, summary, sortExpensesByDateLatest } = useExpenseSummary();
  const [incomes, setIncomes] = useState([]);

  const fetchIncomes = async () => {
    try {
      const data = await IncomeService.getMyIncome();
      setIncomes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching incomes:', error);
      setIncomes([]);
    }
  };

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleAddExpense = async () => {
    try {
      // await ExpenseService.addExpense(expenseData);
      setIsFormOpen(false);
      fetchExpenses();
      fetchIncomes();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  React.useEffect(() => {
    fetchIncomes();
  }, []);

  return (
    <>
      <StyledDashboardLayout>
        <Stats summary={summary} incomes={incomes} />
        <ExpenseActivity expenses={sortExpensesByDateLatest()} />
        <PieChart expenses={expenses} />
        <IncomeActivity incomes={[...incomes].sort((a, b) => new Date(b.date) - new Date(a.date))} />
        <PieChart expenses={incomes} />
        <LineChart expenses={sortExpensesByDateLatest()} incomes={[...incomes].sort((a, b) => new Date(a.date) - new Date(b.date))} />
      </StyledDashboardLayout>

      <AddButton onClick={handleOpenForm}>
        <AiOutlinePlus />
      </AddButton>
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleAddExpense}
      />
    </>
  );
}

export default DashboardLayout;
