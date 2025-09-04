import { useState, useEffect } from "react";
import BillService from "../service/BillService";

const useBillSummary = () => {
  const [bills, setBills] = useState([]);
  const [summary, setSummary] = useState({
    totalTillToday: 0,
    totalThisMonth: 0,
    totalThisYear: 0,
  });

  // Lấy danh sách bills
  const fetchBills = async () => {
    try {
      const fetchedBills = await BillService.getMyBills();
      setBills(Array.isArray(fetchedBills) ? fetchedBills : []);
    } catch (error) {
      console.error("Error fetching bills:", error.message);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // Tính toán summary
  useEffect(() => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const totalTillToday = bills.reduce((total, bill) => {
      const billDate = new Date(bill.date || bill.createdAt || today); // fallback
      return billDate <= today ? total + parseFloat(bill.totalAmount || 0) : total;
    }, 0);

    const totalThisMonth = bills.reduce((total, bill) => {
      const billDate = new Date(bill.date || bill.createdAt || today);
      return billDate.getMonth() + 1 === currentMonth &&
        billDate.getFullYear() === currentYear
        ? total + parseFloat(bill.totalAmount || 0)
        : total;
    }, 0);

    const totalThisYear = bills.reduce((total, bill) => {
      const billDate = new Date(bill.date || bill.createdAt || today);
      return billDate.getFullYear() === currentYear
        ? total + parseFloat(bill.totalAmount || 0)
        : total;
    }, 0);

    setSummary({
      totalTillToday: totalTillToday.toFixed(2),
      totalThisMonth: totalThisMonth.toFixed(2),
      totalThisYear: totalThisYear.toFixed(2),
    });
  }, [bills]);

  // Sort theo ngày mới nhất
  const sortBillsByDateLatest = () =>
    bills.slice().sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

  // Sort theo ngày cũ nhất
  const sortBillsByDateOldest = () =>
    bills.slice().sort((a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt));

  // Sort theo tổng tiền giảm dần
  const sortBillsByAmountMax = () =>
    bills.slice().sort((a, b) => parseFloat(b.totalAmount || 0) - parseFloat(a.totalAmount || 0));

  // Sort theo tổng tiền tăng dần
  const sortBillsByAmountMin = () =>
    bills.slice().sort((a, b) => parseFloat(a.totalAmount || 0) - parseFloat(b.totalAmount || 0));

  return {
    bills,
    summary,
    fetchBills,
    sortBillsByDateLatest,
    sortBillsByDateOldest,
    sortBillsByAmountMax,
    sortBillsByAmountMin,
  };
};

export { useBillSummary };
