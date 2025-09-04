import React, { useEffect, useState } from "react";
import BillService from "../service/BillService";
import { useParams } from "react-router-dom";
import { Heading, Row } from "../ui";

function BillDetail() {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await BillService.getById(id);
        setBill(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (!bill) return null;

  return (
    <div>
      <Row type="horizontal">
        <Heading as="h1">Chi tiết Bill #{bill.id}</Heading>
      </Row>

      <div style={{ marginBottom: 16 }}>
        <div>Tổng tiền: {bill.totalAmount}</div>
        <div>Kiểu chia: {bill.splitType}</div>
        <div>Người trả: {bill.paidBy?.name} ({bill.paidBy?.type})</div>
      </div>

      <h3>Thành viên</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Tên</th>
            <th style={{ textAlign: 'left' }}>Loại</th>
            <th style={{ textAlign: 'left' }}>Số tiền</th>
            <th style={{ textAlign: 'left' }}>%</th>
          </tr>
        </thead>
        <tbody>
          {bill.participants?.map((p, idx) => (
            <tr key={idx}>
              <td>{p.name}</td>
              <td>{p.type}</td>
              <td>{p.amount}</td>
              <td>{p.percent ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Ai nợ ai</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Từ</th>
            <th style={{ textAlign: 'left' }}>Đến</th>
            <th style={{ textAlign: 'left' }}>Số tiền</th>
          </tr>
        </thead>
        <tbody>
          {bill.debts?.map((d, idx) => (
            <tr key={idx}>
              <td>{d.fromName}</td>
              <td>{d.toName}</td>
              <td>{d.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BillDetail;


