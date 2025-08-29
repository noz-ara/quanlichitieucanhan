import React, { useState } from 'react';
import { Form, Label, RadioButton, Button, Input, TextArea, Modal } from '../ui'; 
import { styled } from 'styled-components';
import ExpenseService from '../service/ExpenseService';

const ExpenseForm = ({ isOpen, onClose, onSubmit }) => {
  const [expenseType, setExpenseType] = useState('daily');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [recurrence, setRecurrence] = useState('monthly');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');

  const handleExpenseSubmit = async (event) => {
    event.preventDefault();

    // Prepare expense data
    const expenseData = {
      expenseType,
      amount,
      category,
      description,
      date,
      recurrence,
      recurrenceEndDate 
    };

    try {
      await ExpenseService.addExpense(expenseData);
      onSubmit(expenseData); 
      resetForm();
      onClose(); // Close modal after successful submission
    } catch (error) {
      console.error('Error adding expense:', error);
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
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Form onSubmit={handleExpenseSubmit}>
        <RadioButton
          id="daily"
          value="daily"
          checked={expenseType === 'daily'}
          onChange={() => setExpenseType('daily')}
          label='Daily Expense'
        />
        <RadioButton
          id="oneTime"
          value="oneTime"
          checked={expenseType === 'oneTime'}
          onChange={() => setExpenseType('oneTime')}
          label='One-time Expense'
        />
        <RadioButton
          id="recurring"
          value="recurring"
          checked={expenseType === 'recurring'}
          onChange={() => setExpenseType('recurring')}
          label='Recurring Expense'
        />
        {/* Render additional fields based on selected expense type */}
        <>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            required
          />
          <Input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            required
          />
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder='Expense Date'
          />
        </>
        {expenseType === 'recurring' && (
          <>
            <RadioButton
              value="monthly"
              checked={recurrence === 'monthly'}
              onChange={() => setRecurrence('monthly')}
              label='Monthly'
            />
            <RadioButton
              value="yearly"
              checked={recurrence === 'yearly'}
              onChange={() => setRecurrence('yearly')}
              label='Yearly'
            />
            <Label>Recurrence End Date</Label>
            <Input
              type="date"
              value={recurrenceEndDate}
              onChange={(e) => setRecurrenceEndDate(e.target.value)}
              placeholder="Recurrence End Date"
            />
          </>
        )}
        <Button type="submit">Add Expense</Button>
      </Form>
    </Modal>
  );
};

export default ExpenseForm;
