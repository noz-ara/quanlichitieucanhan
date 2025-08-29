import React, { useState } from "react";
import styled from "styled-components";
import { Button, Input, Select } from "../ui";

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
    const paidByFriend = bill ? bill - paidByUser : "";
    const [whoIsPaying, setWhoIsPaying] = useState("user");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!bill || !paidByUser) return;
        onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
    };

    return (
        <Form className="form-split-bill" onSubmit={handleSubmit}>
            <Title>🧐 Chia hóa đơn với {selectedFriend.name}</Title>
            <Label>💵 Giá trị hóa đơn</Label>
            <Input
                type="text"
                value={bill}
                onChange={(e) => setBill(Number(e.target.value))}
            />
            <Label>💰 Chi phí của bạn</Label>
            <Input
                type="text"
                value={paidByUser}
                onChange={(e) =>
                    setPaidByUser(
                        Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
                    )
                }
            />
            <Label>🤝 {selectedFriend.name}'s chi phí</Label>
            <Input type="text" disabled value={paidByFriend} />
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
            <Button>Chia hóa đơn</Button>
        </Form>
    );
};

export default FormSplitBill;
