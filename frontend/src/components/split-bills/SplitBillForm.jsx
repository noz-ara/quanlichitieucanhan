import React, { useState } from "react";
import styled from "styled-components";
import { Button, Input, Select, ErrorMessage } from "../ui";

const Form = styled.form`
  width: 300px;
  font-size: 1.6rem;
  display: grid;
  align-items: center;
  /* gap: 1rem; */
  background-color: var(--color-lightest);
  border-radius: 7px;
  Button{
    margin-top: 2rem;
  }
`;

const Title = styled.h2`
  grid-column: 1 / -1;
  font-size: 2.2rem;
  text-transform: capitalize;
  letter-spacing: -0.5px;
  margin-bottom: 1.6rem;
`;

const Label = styled.div`
    font-weight: 500;
    margin-top: 1rem;
    &:first-letter {
        display: inline-block;
        margin-right: 4px;
        font-size: 1.8rem;
    }
`;

const FormSplitBill = ({ selectedFriend, onSplitBill }) => {
    const [bill, setBill] = useState("");
    const [paidByUser, setPaidByUser] = useState("");
    const [whoIsPaying, setWhoIsPaying] = useState("user");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const paidByFriend = bill && paidByUser ? Math.max(0, bill - paidByUser) : 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        // Validation
        if (!bill || bill <= 0) {
            setError("Vui lòng nhập giá trị hóa đơn hợp lệ");
            setIsSubmitting(false);
            return;
        }

        if (!paidByUser || paidByUser < 0) {
            setError("Vui lòng nhập chi phí của bạn hợp lệ");
            setIsSubmitting(false);
            return;
        }

        if (paidByUser > bill) {
            setError("Chi phí của bạn không thể lớn hơn tổng hóa đơn");
            setIsSubmitting(false);
            return;
        }

        try {
            const splitAmount = whoIsPaying === "user" ? paidByFriend : -paidByUser;
            await onSplitBill(splitAmount);
        } catch (error) {
            setError("Đã xảy ra lỗi khi chia hóa đơn");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form className="form-split-bill" onSubmit={handleSubmit}>
            <Title>🧐 Chia hóa đơn với {selectedFriend.name}</Title>
            <Label>💵 Giá trị hóa đơn</Label>
            <Input
                type="number"
                min="0"
                step="0.01"
                value={bill}
                onChange={(e) => setBill(Number(e.target.value))}
                placeholder="Nhập giá trị hóa đơn"
            />
            <Label>💰 Chi phí của bạn</Label>
            <Input
                type="number"
                min="0"
                step="0.01"
                max={bill}
                value={paidByUser}
                onChange={(e) => setPaidByUser(Number(e.target.value))}
                placeholder="Nhập chi phí của bạn"
            />
            <Label>🤝 {selectedFriend.name}'s chi phí</Label>
            <Input 
                type="number" 
                disabled 
                value={paidByFriend.toFixed(2)} 
                placeholder="Tự động tính"
            />
            <Label>🤓 Ai sẽ thanh toán hóa đơn</Label>
            <Select
                options={[
                    { value: "user", label: "Bạn" },
                    { value: "friend", label: `${selectedFriend.name}` }
                ]}
                value={whoIsPaying}
                onChange={(e) => setWhoIsPaying(e.target.value)}
            >
            </Select>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Button disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý..." : "Chia hóa đơn"}
            </Button>
        </Form>
    );
};

export default FormSplitBill;
