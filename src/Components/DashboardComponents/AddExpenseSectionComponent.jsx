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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showRecurringOnly, setShowRecurringOnly] = useState(false);
  const [filteredExpense, setFilteredExpense] = useState(expenses);
  const [sortOrder, setSortOrder] = useState('desc');
  


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

    if (selectedCategory !== null && selectedCategory !== "") {
      updatedExpenses = updatedExpenses.filter(
        (expense) => expense.category_type === selectedCategory
      );
    }
    

    if(showRecurringOnly) {
      updatedExpenses = updatedExpenses.filter(
        (expenses) => expenses.is_recurring
      )
    }
  
    setFilteredExpense(updatedExpenses);
  }, [expenseUser.expenses, selectedYear, selectedMonth, showRecurringOnly, selectedCategory]);

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
      setFilteredExpense(() =>
        selectedYear
          ? expenses.filter((expense) =>
              expense.date_incurred.startsWith(selectedYear.toString())
            )
          : expenses
      );
    } else {
      setSelectedMonth(monthIndex);
      setFilteredExpense(() =>
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

  const expensesCategoryTypes = expenses.filter((expense) => expense.category_type);
  const allExpenseCategories = Array.from(new Set(expenses.map((expense) => expense.category_type))); 
  console.log('expensesCategoryTypes:', expensesCategoryTypes);
  console.log('allExpenseCategories:', allExpenseCategories);



const handleCategoryClick = (category) => {
  setSelectedCategory((prevCategory) => (prevCategory === category ? null : category));
};

const toggleSortOrder = () => {
  setSortOrder((previousOrder) => (previousOrder === 'asc' ? 'desc' : 'asc'));
};

const sortedExpense = filteredExpense.slice().sort((a, b) => {
  if (sortOrder === 'asc') {
    return new Date(a.date_incurred) - new Date(b.date_incurred);
  } else {
    return new Date(b.date_incurred) - new Date(a.date_incurred);
  }
});

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
            <h3 className="text-gray-800 font-bold text-lg mb-4">Years</h3>
            <div className="relative">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white"
                value={selectedYear !== null ? selectedYear : ""}
                onChange={(event) => handleYearClick(Number(event.target.value))}>
                <option value="" disabled>
                  Select a year
                </option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

  
            <h3 className="text-gray-800 font-bold text-lg mt-6 mb-4">Months</h3>
            <div className="relative">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white"
                value={selectedMonth !== null ? selectedMonth : ""}
                onChange={(event) => handleMonthClick(Number(event.target.value))} >
                <option value="" disabled>
                  Select a month
                </option>
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <h3 className="text-gray-800 font-bold text-lg mt-6 mb-4">Categories</h3>
            <div className="relative">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white"
                value={selectedCategory || ""}
                onChange={(event) => handleCategoryClick(event.target.value)}>
                  <option value="" disabled>
                    Select an expense category
                  </option>
                <option value="">All Categories</option>
                {allExpenseCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

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
            <th onClick={toggleSortOrder} className="border border-gray-300 px-4 py-2 text-center text-gray-600 cursor-pointer">
              Date Incurred
              {sortOrder === 'asc' ? ' ▲' : ' ▼'}
              </th>
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
          ) : sortedExpense.length > 0 ? (
            sortedExpense
              // .slice()
              .slice(0, showAllExpense ? sortedExpense.length : 4)
              // .sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
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
