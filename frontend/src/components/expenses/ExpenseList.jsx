import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Heading, ButtonIcon, Modal } from '../ui';
import ExpenseListItem from '../expenses/ExpenseItem';
import ExpenseForm from './ExpenseForm';
import { styled } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import ExpenseSummary from './ExpenseSummary';
import ExpenseService from '../service/ExpenseService';

const ListContainer = styled.div`
  margin: 10px;
`;

const ExpenseList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expenseList, setExpenseList] = useState([]);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const fetchedExpenses = await ExpenseService.getAllExpenses();
                setExpenseList(fetchedExpenses);
            } catch (error) {
                console.error('Error fetching expenses:', error.message);
            }
        };
        fetchExpenses();
    }, []);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Function to add recurring expenses recursively
    const addRecurringExpense = (amount, category, description, date, recurrence, recurrenceEndDate) => {
        let nextDate = new Date(date);

        // Add expenses until the end date
        while (nextDate <= recurrenceEndDate) {
            // Add the expense for the current occurrence
            setExpenseList(prevExpenseList => [...prevExpenseList,
            {
                id: uuidv4(), amount, category, description, date: nextDate.toISOString().split('T')[0],
                expenseType: 'recurring'
            }]);

            // Calculate the next occurrence based on the recurrence
            if (recurrence === 'monthly') {
                nextDate.setMonth(nextDate.getMonth() + 1);
            } else if (recurrence === 'yearly') {
                nextDate.setFullYear(nextDate.getFullYear() + 1);
            }
        }
    };

    const handleAddExpense = (expenseData) => {
        setExpenseList(prevExpenseList => [...prevExpenseList, { id: uuidv4(), ...expenseData }]);

        // If the expense is recurring, add it recursively
        if (expenseData.expenseType === 'recurring') {
            const { amount, category, description, date, recurrenceEndDate, recurrence } = expenseData;

            // Start adding recurring expenses
            addRecurringExpense(amount, category, description, date, recurrence, recurrenceEndDate);
        }

        // Close the modal
        closeModal();
    };

    return (
        <div>
            {/* <Heading as='h1'>Expenses</Heading> */}
            <ButtonIcon onClick={openModal}><FaPlus /> Add Expense</ButtonIcon>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ExpenseForm onSubmit={handleAddExpense} />
            </Modal>
            <ListContainer>
            {console.log(expenseList)}
                {expenseList?.map((expense) => (
                    <ExpenseListItem key={expense.id} expense={expense} />
                ))}
            </ListContainer>
            <ExpenseSummary expenses={expenseList} />
        </div>
    );
};

export default ExpenseList;
