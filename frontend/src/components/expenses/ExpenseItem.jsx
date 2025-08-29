import React from 'react';
import styled from 'styled-components';

const ItemContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 8px;
`;

const ExpenseItem = ({ expense }) => {
  return (
    <ItemContainer className='expense-item'>
      <p>Amount: {expense.amount}</p>
      <p>Category: {expense.category}</p>
      <p>Description: {expense.description}</p>
      <p>Date: {expense.date}</p>
      {/* <h3>{expense.description}</h3>
      <p>Amount: ${expense.amount}</p>
      <p>Date: {expense.date}</p> */}
    </ItemContainer>
  );
};

export default ExpenseItem;
