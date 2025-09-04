import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { AiOutlinePlus } from "react-icons/ai";

import Stats from "../features/Stats";
import ExpenseActivity from "../features/ExpenseActivity";
import IncomeActivity from "../features/IncomeActivity";
import ExpenseForm from "../expenses/ExpenseForm";
import ExpenseService from "../service/ExpenseService";
import IncomeService from "../service/IncomeService";
import { useExpenseSummary } from "../hooks/useExpenseSummary";
import useChartData from "../hooks/useChartData";
import PieChartComponent from "../features/PieChartComponent";
import LineChartComponent from "../features/LineChartComponent";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto;
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
  const { expenses, fetchExpenses, summary, sortExpensesByDateLatest } =
    useExpenseSummary();
  const [incomes, setIncomes] = useState([]);

  // Chart data
  const { expensePie, incomePie, lineData } = useChartData(expenses, incomes);

  // Fetch incomes
  const fetchIncomes = async () => {
    try {
      const data = await IncomeService.getMyIncomes();
      setIncomes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching incomes:", error);
      setIncomes([]);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchIncomes();
  }, []);

  // Handle form
  const handleOpenForm = () => setIsFormOpen(true);
  const handleCloseForm = () => setIsFormOpen(false);

  const handleAddExpense = async (expenseData) => {
    try {
      await ExpenseService.addExpense(expenseData);
      setIsFormOpen(false);
      fetchExpenses();
      fetchIncomes();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <>
      <StyledDashboardLayout>
        {/* Tổng quan */}
        <Stats summary={summary} incomes={incomes} />

        {/* Hoạt động gần đây */}
        <ExpenseActivity expenses={sortExpensesByDateLatest()} />
        <PieChartComponent data={expensePie} title="Chi tiêu theo danh mục" />
        <IncomeActivity
          incomes={[...incomes].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          )}
        />

        {/* Biểu đồ */}
        
        <PieChartComponent data={incomePie} title="Thu nhập theo danh mục" />
        <LineChartComponent expenses={expenses} incomes={incomes} />

      </StyledDashboardLayout>

      {/* Nút thêm chi tiêu */}
      <AddButton onClick={handleOpenForm}>
        <AiOutlinePlus />
      </AddButton>

      {/* Form thêm chi tiêu */}
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleAddExpense}
      />
    </>
  );
}

export default DashboardLayout;
