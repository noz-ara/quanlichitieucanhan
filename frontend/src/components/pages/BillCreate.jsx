import React, { useEffect, useMemo, useState } from "react";
import BillService from "../service/BillService";
import ContactService from "../service/ContactService";
import { Button, Heading, Row, Input, Select } from "../ui";

const BillCreate = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [splitType, setSplitType] = useState("EQUAL");
  const [contacts, setContacts] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]); // placeholder nếu có danh sách user khác
  const [selectedContactIds, setSelectedContactIds] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const list = await ContactService.listMy();
        setContacts(list || []);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    // build participants theo lựa chọn
    const fromContacts = selectedContactIds.map((id) => ({ contactId: id }));
    const fromUsers = selectedUserIds.map((id) => ({ userId: id }));
    let p = [...fromUsers, ...fromContacts];
    if (splitType === "PERCENT") {
      const percent = p.length > 0 ? Math.floor(100 / p.length) : 0;
      p = p.map((x) => ({ ...x, percent }));
    }
    if (splitType === "CUSTOM") {
      const amount = p.length > 0 ? Number(totalAmount) / p.length : 0;
      p = p.map((x) => ({ ...x, amount }));
    }
    setParticipants(p);
  }, [selectedContactIds, selectedUserIds, splitType, totalAmount]);

  const canSubmit = useMemo(() => {
    return Number(totalAmount) > 0 && participants.length >= 2;
  }, [totalAmount, participants.length]);

  const submit = async () => {
    setLoading(true);
    setMessage("");
    try {
      const payload = {
        totalAmount: Number(totalAmount),
        splitType,
        participants,
        paidByUserId: null, // có thể set id của bạn nếu cần
      };
      const res = await BillService.create(payload);
      setMessage(`Tạo bill thành công #${res.id || ""}`);
    } catch (e) {
      setMessage("Tạo bill thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Row type="horizontal">
        <Heading as="h1">Tạo bill</Heading>
      </Row>
      <div style={{ display: "grid", gap: 12, maxWidth: 520 }}>
        <label>
          Tổng tiền
          <Input type="number" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} />
        </label>
        <label>
          Kiểu chia
          <Select
            value={splitType}
            onChange={(e) => setSplitType(e.target.value)}
            options={[
              { value: "EQUAL", label: "EQUAL (chia đều)" },
              { value: "PERCENT", label: "PERCENT" },
              { value: "CUSTOM", label: "CUSTOM" },
            ]}
          />
        </label>
        <div>
          <div>Chọn contacts tham gia</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {contacts.map((c) => (
              <label key={c.id} style={{ display: "inline-flex", gap: 6 }}>
                <input
                  type="checkbox"
                  checked={selectedContactIds.includes(c.id)}
                  onChange={(e) =>
                    setSelectedContactIds((prev) =>
                      e.target.checked ? [...prev, c.id] : prev.filter((x) => x !== c.id)
                    )
                  }
                />
                {c.name}
              </label>
            ))}
          </div>
        </div>
        <Button onClick={submit} disabled={!canSubmit || loading}>
          {loading ? "Đang tạo..." : "Tạo bill"}
        </Button>
        {message && <div>{message}</div>}
      </div>
    </div>
  );
};

export default BillCreate;


