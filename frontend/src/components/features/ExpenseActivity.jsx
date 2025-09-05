import React, { useState } from "react";
import styled from "styled-components";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import { formatCurrency } from "../utils/helpers";
import { FaTrash } from "react-icons/fa";
import ExpenseService from "../service/ExpenseService";

const StyledToday = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 3.2rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  grid-column: 1 / span 2;
  padding-top: 2.4rem;
`;

const TodayList = styled.ul`
  max-height: 300px;  /* hoặc 100%, hoặc vh tùy layout */
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-grey-300);
    border-radius: 10px;
  }

  scrollbar-width: thin;
  -ms-overflow-style: none;
`;

const NoActivity = styled.p`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 500;
  margin-top: 0.8rem;
`;

const StyledListItem = styled.li`
  background-color: var(--color-white);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  padding: 1.6rem;
  margin-bottom: 1.2rem;
  box-shadow: var(--shadow-sm);
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    .tooltip {
      opacity: 1;
      visibility: visible;
    }
  }
`;

const ListItemContent = styled.div`
  flex: 1;
`;

const ListItemHeading = styled.h3`
  font-size: 1.6rem;
  margin-bottom: 0.8rem;
`;

const ListItemText = styled.p`
  font-size: 1.4rem;
  line-height: 1.6;
`;

const Tooltip = styled.div`
  position: absolute;
  top: calc(10% + 8px);
  left: 70%;
  transform: translateX(-50%);
  background-color: var(--color-grey-100);
  color: var(--color-grey-700);
  padding: 0.8rem;
  border-radius: var(--border-radius-sm);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  display: block;

  &::before {
    content: "";
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 8px;
    border-style: solid;
    border-color: transparent transparent var(--color-grey-800) transparent;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: var(--color-red-500);
  font-size: 1.6rem;
  cursor: pointer;

  &:hover {
    color: var(--color-red-700);
  }
`;

function ExpenseActivity({ expenses, onDelete }) {
  const [hoveredExpense, setHoveredExpense] = useState(null);

  const handleDelete = async (id) => {
    try {
      await ExpenseService.deleteExpense(id);
      onDelete(); // gọi lại fetchExpenses() từ DashboardLayout
    } catch (err) {
      console.error("Lỗi khi xoá chi tiêu:", err);
    }
  };
  const handleMouseEnter = (expense) => setHoveredExpense(expense);
  const handleMouseLeave = () => setHoveredExpense(null);

  return (
    <StyledToday>
      <Row type="horizontal">
        <Heading as="h2">Chi tiêu</Heading>
      </Row>
      {expenses && expenses.length > 0 ? (
        <TodayList>
          {expenses.map((expense) => (
            <StyledListItem
              key={expense.expense_id}
              onMouseEnter={() => handleMouseEnter(expense)}
              onMouseLeave={handleMouseLeave}
            >
              <ListItemContent>
                <ListItemHeading>{expense.category}</ListItemHeading>
                <ListItemText>
                  <strong>Số tiền:</strong> {formatCurrency(expense.amount)}
                  <br />
                  <strong>Ngày:</strong>{" "}
                  {new Date(expense.date).toLocaleDateString("vi-VN")}
                </ListItemText>
                {hoveredExpense &&
                  hoveredExpense.expense_id === expense.expense_id && (
                    <Tooltip className="tooltip">
                      <strong>Mô tả:</strong>{" "}
                      {expense.description || "Không có mô tả"}
                    </Tooltip>
                  )}
              </ListItemContent>

              {/* Nút xóa */}
              <DeleteButton onClick={() => handleDelete(expense.expense_id)}>
                <FaTrash />
              </DeleteButton>
            </StyledListItem>
          ))}
        </TodayList>
      ) : (
        <NoActivity>Không có chi tiêu nào được ghi nhận hôm nay.</NoActivity>
      )}
    </StyledToday>
  );
}

export default ExpenseActivity;
