import React from 'react';
import styled from 'styled-components';
import { formatCurrency } from '../utils/helpers';

const ItemContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 8px;
`;

const ExpenseItem = ({ expense }) => {
  return (
    <ItemContainer className="expense-item">
      <p>Số tiền: {formatCurrency(expense.amount)}</p>
      <p>Danh mục: {expense.category}</p>
      <p>Mô tả: {expense.description || "Không có mô tả"}</p>
      <p>Ngày: {new Date(expense.date).toLocaleDateString("vi-VN")}</p>
    </ItemContainer>
  );
};

export default ExpenseItem;
