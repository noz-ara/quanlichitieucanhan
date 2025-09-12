import React, { useState, useEffect } from 'react';
import { Form, Label, RadioButton, Button, Input, TextArea, Modal, ErrorMessage } from '../ui';
import styled from 'styled-components';

const Select = styled.select`
  padding: 0.8rem 1rem;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  font-size: 1.4rem;
  color: var(--color-grey-700);
  margin-bottom: 1rem;
  width: 100%;

  &:focus {
    outline: 2px solid var(--color-brand-600);
    outline-offset: 2px;
  }
`;

const ExpenseForm = ({ isOpen, onClose, onSubmitExpense, onSubmitIncome }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [budgetGroup, setBudgetGroup] = useState('ESSENTIAL');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionType, setTransactionType] = useState('EXPENSE'); // EXPENSE | INCOME

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const handleUseToday = () => setDate(today);

  useEffect(() => {
    // Reset nhóm ngân sách khi chuyển sang thu nhập
    if (transactionType === 'INCOME') {
      setBudgetGroup('ESSENTIAL');
    }
  }, [transactionType]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!amount || amount <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ');
      setIsSubmitting(false);
      return;
    }

    if (!category.trim()) {
      setError('Vui lòng nhập danh mục');
      setIsSubmitting(false);
      return;
    }

    if (!date) {
      setError('Vui lòng chọn ngày');
      setIsSubmitting(false);
      return;
    }

    const expenseData = {
      expenseType: 'daily', // luôn là hằng ngày
      amount: parseFloat(amount),
      category: category.trim(),
      description: description.trim(),
      date,
      budgetGroup: transactionType === 'EXPENSE' ? budgetGroup : undefined
    };

    try {
      if (transactionType === 'INCOME') {
        await onSubmitIncome(expenseData);
      } else {
        await onSubmitExpense(expenseData);
      }
      resetForm();
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Đã xảy ra lỗi khi thêm giao dịch');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setCategory('');
    setDescription('');
    setDate('');
    setBudgetGroup('ESSENTIAL');
    setError('');
    setIsSubmitting(false);
    setTransactionType('EXPENSE');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        style={{
          width: '480px',
          maxHeight: '80vh',
          overflowY: 'auto',
          padding: '1rem',
        }}
      >
        <Form onSubmit={handleSubmit}>
          {/* Loại khoản */}
          <Label>Loại khoản</Label>
          <div style={{ display: 'flex', marginBottom: '1rem' }}>
            <RadioButton
              id="typeExpense"
              name="transactionType"
              value="EXPENSE"
              checked={transactionType === 'EXPENSE'}
              onChange={() => setTransactionType('EXPENSE')}
              label="Chi"
            />
            <RadioButton
              id="typeIncome"
              name="transactionType"
              value="INCOME"
              checked={transactionType === 'INCOME'}
              onChange={() => setTransactionType('INCOME')}
              label="Thu"
            />
          </div>

          {/* Số tiền */}
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Số tiền"
            required
          />

          {/* Danh mục */}
          <Input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Danh mục"
            required
          />

          {/* Nhóm ngân sách chỉ hiện khi là chi */}
          {transactionType === 'EXPENSE' && (
            <>
              <Label>Nhóm ngân sách</Label>
              <Select value={budgetGroup} onChange={(e) => setBudgetGroup(e.target.value)}>
                <option value="ESSENTIAL">Thiết yếu</option>
                <option value="WANTS">Mong muốn</option>
              </Select>
            </>
          )}

          {/* Mô tả */}
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả"
          />

          {/* Ngày */}
          <Label>Ngày</Label>
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder={`Gợi ý: ${today}`}
            />
            <Button type="button" onClick={handleUseToday}>
              Dùng hôm nay
            </Button>
          </div>

          {/* Lỗi */}
          {error && <ErrorMessage>{error}</ErrorMessage>}

          {/* Nút submit */}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Đang thêm...'
              : transactionType === 'INCOME'
                ? 'Thêm thu nhập'
                : 'Thêm chi phí'}
          </Button>
        </Form>
      </div>
    </Modal>
  );
};

export default ExpenseForm;
