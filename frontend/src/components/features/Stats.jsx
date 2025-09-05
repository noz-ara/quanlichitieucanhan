import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Stat from '../ui/Stat';
import { formatCurrency } from '../utils/helpers';
import { FaMoneyBill, FaCalendarAlt, FaRegCalendar } from 'react-icons/fa';
import { MdAccountBalance } from 'react-icons/md';
import { useUser } from '../hooks/useUser';
import { GiExpense } from 'react-icons/gi';


function Stats({ expenseSummary, incomeSummary }) {
  const { user } = useUser();
  console.log("Expense Summary:", expenseSummary);
  console.log("Income Summary:", incomeSummary);

  const Grid = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 1.6rem;
    grid-column: 1 / span 4;
  `;

  return (
    <Grid>
      <Stat
        title='Số dư tài khoản'
        color='blue'
        icon={<MdAccountBalance />}
        value={formatCurrency(user?.balance)}
      />
      <Stat
        title='Tổng chi tiêu'
        color='grey'
        icon={<GiExpense />}
        value={formatCurrency(expenseSummary?.totalTillToday || 0)}
      />
      <Stat
        title='Chi tiêu trong tháng'
        color='indigo'
        icon={<FaCalendarAlt />}
        value={formatCurrency(expenseSummary?.totalThisMonth || 0)}
      />
      <Stat
        title="Chi tiêu trong năm"
        color='green'
        icon={<FaRegCalendar />}
        value={formatCurrency(expenseSummary?.totalThisYear || 0)}
      />
      <Stat
        title='Tổng thu nhập'
        color='yellow'
        icon={<FaMoneyBill />}
        value={formatCurrency(incomeSummary?.totalTillToday || 0)}
      />
      <Stat
        title='Thu nhập trong tháng'
        color='indigo'
        icon={<FaCalendarAlt />}
        value={formatCurrency(incomeSummary?.totalThisMonth || 0)}
      />
      <Stat
        title='Thu nhập trong năm'
        color='green'
        icon={<FaRegCalendar />}
        value={formatCurrency(incomeSummary?.totalThisYear || 0)}
      />
    </Grid>
  );
}
export default Stats;
