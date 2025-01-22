import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

const AddExpenseSectionComponent = ({
  expenseUser,
  formatCurrency,
  totalExpenses,
  setExpenseToEdit,
  setIsEditingExpense,
  deleteExpense,
  showAllExpense,
  setShowAllExpense,
}) => {

  const expenses = expenseUser?.expenses || []; 

  const [showYears, setShowYears] = useState(false);
  const [uniqueYears, setUniqueYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showRecurringOnly, setShowRecurringOnly] = useState(false);
  const [filteredExpense, setFilteredExpense] = useState(expenses);
  


  //Display all months so the user can filter by month
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  //Update expenses
  useEffect(() => {
    let updatedExpenses = expenseUser.expenses;
  
    if (selectedYear !== null) {
      updatedExpenses = updatedExpenses.filter(
        (income) => Number(income.date_incurred.slice(0, 4)) === selectedYear
      );
    }
  
    if (selectedMonth !== null) {
      updatedExpenses = updatedExpenses.filter(
        (income) => Number(income.date_incurred.slice(5, 7)) - 1 === selectedMonth
      );
    }

    if(showRecurringOnly) {
      updatedExpenses = updatedExpenses.filter(
        (expenses) => expenses.is_recurring
      )
    }
  
    setFilteredExpense(updatedExpenses);
  }, [expenseUser.expenses, selectedYear, selectedMonth, showRecurringOnly]);

  //Toggle Recurring Expenses
  const toggleRecurringExpenses = () => {
    setShowRecurringOnly((previous) => !previous);
  }


  //User to filter by year
  const handleYearClick = (year) => {
    if (selectedYear === year) {
      setSelectedYear(null); 
      setFilteredExpense(expenses); 
    } else {
      setSelectedYear(year);
      setFilteredExpense(
        expenses.filter(
          (expense) => Number(expense.date_incurred.slice(0, 4)) === year
        )
      );
    }
  };

  //User to filter by month
  const handleMonthClick = (monthIndex) => {
    if (selectedMonth === monthIndex) {
      setSelectedMonth(null);
      setFilteredExpense((previous) =>
        selectedYear
          ? expenses.filter((expense) =>
              expense.date_incurred.startsWith(selectedYear.toString())
            )
          : expenses
      );
    } else {
      setSelectedMonth(monthIndex);
      setFilteredExpense((previous) =>
        expenses.filter((expense) => {
          const expenseYear = Number(expense.date_incurred.slice(0, 4));
          const expenseMonth = Number(expense.date_incurred.slice(5, 7)) - 1;
          return (
            (selectedYear ? expenseYear === selectedYear : true) &&
            expenseMonth === monthIndex
          );
        })
      );
    }
  };

  //Display all years user used app
  const allUserYears = () => {
    console.log('userData in allUserYears:', expenses);
    const expenseYears = expenses.map((income) => {
      const year = Number(income.date_incurred.slice(0,4));
      return year 
    })

    const uniqueYearsList = Array.from(new Set(expenseYears));

    setUniqueYears(uniqueYearsList);
    console.log('uniqueYearsList:', uniqueYearsList);
    setShowYears(previous => !previous);
  }


  const recurringExpenses = expenseUser.expenses.filter((expense) => expense.is_recurring);
  console.log('recurringExpenses:', recurringExpenses);
console.log('expenseUser:', expenseUser.expenses);
 
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6 border border-gray-200 relative overflow-hidden">
      <div className="relative mb-4">
        <h2 className="text-xl font-semibold text-gray-700 leading-none text-center">
          Added Expenses
        </h2>
        <div
          className="absolute top-0 right-0 text-black text-2xl cursor-pointer"
          onClick={allUserYears}>
          &#x22EE;
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showRecurringOnly}
            onChange={toggleRecurringExpenses}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700">Show Recurring Expenses Only</span>
        </label>
      </div>
  
      {showYears && (
        <div
          className={`absolute top-0 right-0 w-1/3 h-full bg-white shadow-xl rounded-l-lg border-l border-gray-300 z-30 transform ${
            showYears ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out`}>
          <div className="overflow-y-auto h-full p-6">
            <button
              className="absolute top-2 right-2 bg-red-500 text-white rounded-sm w-6 h-6 flex items-center justify-center hover:bg-red-600"
              onClick={allUserYears}>
              &times;
            </button>
            <h3 className="text-gray-800 font-bold text-lg mb-4">Years</h3>
            <ul className="space-y-3">
              {uniqueYears.map((year) => (
                <li
                  className={`text-base font-medium px-4 py-2 rounded-md cursor-pointer ${
                    selectedYear === year
                      ? "bg-green-200 text-green-700"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  } transition-colors`}
                  key={year}
                  onClick={() => handleYearClick(year)}
                >
                  {year}
                </li>
              ))}
            </ul>
  
            <h3 className="text-gray-800 font-bold text-lg mt-6 mb-4">Months</h3>
            <ul className="space-y-3">
              {months.map((month, index) => (
                <li
                  key={month}
                  className={`text-base font-medium px-4 py-2 rounded-md cursor-pointer ${
                    selectedMonth === index
                      ? "bg-blue-200 text-blue-700"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => handleMonthClick(index)}
                >
                  {month}
                </li>
              ))}
            </ul>
            <button
              className="mt-6 w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              onClick={allUserYears}
            >
              Close
            </button>
          </div>
        </div>
      )}
  
      <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Source</th>
            <th className="border border-gray-300 px-4 py-2 text-right text-gray-600">Expense</th>
            <th className="border border-gray-300 px-4 py-2 text-center text-gray-600">Date Incurred</th>
            <th className="border border-gray-300 px-4 py-2 text-center text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center text-gray-500">
                No expenses to display. Add Your Expenses!
              </td>
            </tr>
          ) : filteredExpense.length > 0 ? (
            filteredExpense
              .slice()
              .slice(0, showAllExpense ? filteredExpense.length : 4)
              .sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
              .map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-gray-800">
                    {expense.category}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right text-gray-800">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-800">
                    {expense.date_incurred}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      className="text-sm bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-colors mr-2"
                      onClick={() => {
                        setExpenseToEdit(expense);
                        setIsEditingExpense(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                      onClick={() => deleteExpense(expense.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-gray-500">
                No expenses to display for the time period selected.
              </td>
            </tr>
          )}
        </tbody>
      </table>
  
      <div className="mt-4 text-right font-semibold text-xl text-gray-700">
        Total Expenses: {totalExpenses(filteredExpense)}
      </div>
      <button
        className="mt-4 text-blue-500 hover:underline"
        onClick={() => setShowAllExpense((prevState) => !prevState)}
      >
        {showAllExpense ? 'See Less' : 'See More'}
      </button>
    </div>
  );
  
};

AddExpenseSectionComponent.propTypes = {
  expenseUser: PropTypes.shape({
    expenses: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        date_incurred: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  formatCurrency: PropTypes.func.isRequired,
  totalExpenses: PropTypes.func.isRequired,
  setExpenseToEdit: PropTypes.func.isRequired,
  setIsEditingExpense: PropTypes.func.isRequired,
  deleteExpense: PropTypes.func.isRequired,
  showAllExpense: PropTypes.bool.isRequired,
  setShowAllExpense: PropTypes.func.isRequired,
};

export default AddExpenseSectionComponent;
