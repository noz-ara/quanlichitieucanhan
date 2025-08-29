import React, { useState, useEffect } from 'react';
import Stat from '../ui/Stat';
import { formatCurrency } from '../utils/helpers';
import { FaMoneyBill, FaChartLine, FaCalendarAlt, FaRegCalendar } from 'react-icons/fa';
import { FaRupeeSign } from 'react-icons/fa';
import { MdAccountBalance } from 'react-icons/md';
import { useUser } from '../hooks/useUser';

function Stats({ summary }) {
  const { user } = useUser();

  return (
    <>
      <Stat
        title='Số dư tài khoản'
        color='blue'
        icon={<MdAccountBalance />}
        value={formatCurrency(user?.balance)}
      />
      <Stat
        title='Tổng chi tiêu'
        color='grey'
        icon={<FaRupeeSign />}
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
    </>
  );
}
export default Stats;
