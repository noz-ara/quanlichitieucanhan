import React from 'react'
import ExpenseList from '../expenses/ExpenseList'
import ExpenseSummary from '../expenses/ExpenseSummary'
import ExpenseService from '../service/ExpenseService';

function Expenses() {
    return (
        <>
            <ExpenseList expenses={ExpenseService.getAllExpenses()} />
        </>
    )
}

export default Expenses;