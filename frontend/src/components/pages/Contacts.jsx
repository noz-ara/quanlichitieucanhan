import React, { useEffect, useState } from "react";
import ContactService from "../service/ContactService";
import { Button, Heading, Row, Input, FormRow, Table, ErrorMessage } from "../ui";

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const list = await ContactService.listMy();
      setContacts(list);
    } catch (error) {
      setError("Không thể tải danh bạ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onAdd(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Validation
    if (!name.trim()) {
      setError("Vui lòng nhập tên liên hệ");
      setIsSubmitting(false);
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email không hợp lệ");
      setIsSubmitting(false);
      return;
    }

    try {
      await ContactService.create({ 
        name: name.trim(), 
        email: email.trim() || null 
      });
      setName("");
      setEmail("");
      await load();
    } catch (error) {
      setError(error.response?.data?.message || "Không thể thêm liên hệ");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onDelete(id) {
    try {
      await ContactService.remove(id);
      await load();
    } catch (error) {
      setError("Không thể xóa liên hệ");
    }
  }

  return (
    <div>
      <Row type="horizontal">
        <Heading as="h1">Danh bạ</Heading>
      </Row>

      <form onSubmit={onAdd} style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Input 
            type="text"
            placeholder="Tên" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input 
            type="email"
            placeholder="Email (tuỳ chọn)" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button size="sm" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang thêm..." : "Thêm"}
          </Button>
        </div>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </form>

      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>ID</th>
              <th style={{ textAlign: 'left' }}>Tên</th>
              <th style={{ textAlign: 'left' }}>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.email || '-'}</td>
                <td>
                  <Button size="sm" variation="danger" onClick={() => onDelete(c.id)}>Xoá</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Contacts;


