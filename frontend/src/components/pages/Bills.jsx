import React, { useEffect, useState } from "react";
import BillService from "../service/BillService";
import { Button, Heading, Row } from "../ui";
import { useNavigate } from "react-router-dom";

function Bills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    try {
      const list = await BillService.listMy();
      setBills(list);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <Row type="horizontal">
        <Heading as="h1">Bills của tôi</Heading>
      </Row>
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>ID</th>
              <th style={{ textAlign: 'left' }}>Tổng tiền</th>
              <th style={{ textAlign: 'left' }}>Kiểu chia</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bills.map(b => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.totalAmount}</td>
                <td>{b.splitType}</td>
                <td>
                  <Button size="sm" onClick={() => navigate(`/bills/${b.id}`)}>Xem</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Bills;


