import React, { useState } from 'react';
import { Form, Label, RadioButton, Button, Input, TextArea, Modal, ErrorMessage } from '../ui'; 
import { styled } from 'styled-components';
import ExpenseService from '../service/ExpenseService';
import IncomeService from '../service/IncomeService';

const ExpenseForm = ({ isOpen, onClose, onSubmit }) => {
  const [expenseType, setExpenseType] = useState('daily');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [recurrence, setRecurrence] = useState('monthly');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionType, setTransactionType] = useState('EXPENSE'); // EXPENSE | INCOME

  const handleExpenseSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validation
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

    // Prepare expense data
    const expenseData = {
      expenseType,
      amount: parseFloat(amount),
      category: category.trim(),
      description: description.trim(),
      date,
      recurrence,
      recurrenceEndDate 
    };

    try {
      if (transactionType === 'INCOME') {
        await IncomeService.addIncome(expenseData);
      } else {
        await ExpenseService.addExpense(expenseData);
      }
      onSubmit(expenseData); 
      resetForm();
      onClose(); // Close modal after successful submission
    } catch (error) {
      setError(error.response?.data?.message || 'Đã xảy ra lỗi khi thêm chi phí');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setExpenseType('daily');
    setAmount('');
    setCategory('');
    setDescription('');
    setDate('');
    setRecurrence('monthly');
    setRecurrenceEndDate('');
    setError('');
    setIsSubmitting(false);
    setTransactionType('EXPENSE');
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Form onSubmit={handleExpenseSubmit}>
        <Label>Loại khoản</Label>
        <div style={{ display: 'flex', marginBottom: '1rem' }}>
          <RadioButton
            id="typeExpense"
            name="transactionType"
            value="EXPENSE"
            checked={transactionType === 'EXPENSE'}
            onChange={() => setTransactionType('EXPENSE')}
            label='Chi'
          />
          <RadioButton
            id="typeIncome"
            name="transactionType"
            value="INCOME"
            checked={transactionType === 'INCOME'}
            onChange={() => setTransactionType('INCOME')}
            label='Thu'
          />
        </div>
        <RadioButton
          id="daily"
          value="daily"
          checked={expenseType === 'daily'}
          onChange={() => setExpenseType('daily')}
          label='Chi phí hàng ngày'
        />
        <RadioButton
          id="oneTime"
          value="oneTime"
          checked={expenseType === 'oneTime'}
          onChange={() => setExpenseType('oneTime')}
          label='Chi phí một lần'
        />
        <RadioButton
          id="recurring"
          value="recurring"
          checked={expenseType === 'recurring'}
          onChange={() => setExpenseType('recurring')}
          label='Chi phí định kỳ'
        />
        {/* Render additional fields based on selected expense type */}
        <>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Số tiền"
            required
          />
          <Input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Danh mục"
            required
          />
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả"
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder='Ngày chi tiêu'
          />
        </>
        {expenseType === 'recurring' && (
          <>
            <RadioButton
              value="monthly"
              checked={recurrence === 'monthly'}
              onChange={() => setRecurrence('monthly')}
              label='Hàng tháng'
            />
            <RadioButton
              value="yearly"
              checked={recurrence === 'yearly'}
              onChange={() => setRecurrence('yearly')}
              label='Hàng năm'
            />
            <Label>Ngày kết thúc định kỳ</Label>
            <Input
              type="date"
              value={recurrenceEndDate}
              onChange={(e) => setRecurrenceEndDate(e.target.value)}
              placeholder="Ngày kết thúc định kỳ"
            />
          </>
        )}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang thêm...' : 'Thêm chi phí'}
        </Button>
      </Form>
    </Modal>
  );
};

export default ExpenseForm;
