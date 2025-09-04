import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Stat from '../ui/Stat';
import { formatCurrency } from '../utils/helpers';
import { FaMoneyBill, FaChartLine, FaCalendarAlt, FaRegCalendar } from 'react-icons/fa';
import { FaRupeeSign } from 'react-icons/fa';
import { MdAccountBalance } from 'react-icons/md';
import { useUser } from '../hooks/useUser';
import { GiExpense } from 'react-icons/gi';


function Stats({ summary, incomes = [], incomeSummary }) {
  const { user } = useUser();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalIncome = incomeSummary?.totalTillToday ?? incomes.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0).toFixed(2);
  const totalIncomeThisMonth = incomeSummary?.totalThisMonth ?? incomes
    .filter(i => {
      const d = new Date(i.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, i) => sum + parseFloat(i.amount || 0), 0).toFixed(2);
  const totalIncomeThisYear = incomeSummary?.totalThisYear ?? incomes
    .filter(i => new Date(i.date).getFullYear() === currentYear)
    .reduce((sum, i) => sum + parseFloat(i.amount || 0), 0).toFixed(2);

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
        value={formatCurrency(summary.totalTillToday)}
      />
      <Stat
        title='Chi tiêu trong tháng'
        color='indigo'
        icon={<FaCalendarAlt />}
        value={formatCurrency(summary.totalThisMonth)}
      />
      <Stat
        title="Chi tiêu trong năm"
        color='green'
        icon={<FaRegCalendar />}
        value={formatCurrency(summary.totalThisYear)}
      />
      <Stat
        title='Tổng thu nhập'
        color='yellow'
        icon={<FaMoneyBill />}
        value={formatCurrency(totalIncome)}
      />
      <Stat
        title='Thu nhập trong tháng'
        color='indigo'
        icon={<FaCalendarAlt />}
        value={formatCurrency(totalIncomeThisMonth)}
      />
      <Stat
        title='Thu nhập trong năm'
        color='green'
        icon={<FaRegCalendar />}
        value={formatCurrency(totalIncomeThisYear)}
      />
    </Grid>
  );
}
export default Stats;
