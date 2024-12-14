import PropTypes from 'prop-types';

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

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Added Expenses</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Source</th>
            <th className="border border-gray-300 px-4 py-2 text-right text-gray-600">Expense</th>
            <th className="border border-gray-300 px-4 py-2 text-center text-gray-600">Date Received</th>
            <th className="border border-gray-300 px-4 py-2 text-center text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length > 0 ? (
            expenses
              .slice()
              .reverse()
              .slice(0, showAllExpense ? expenses.length : 4)
              .map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-gray-800">{expense.category}</td>
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
                No expenses to display.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-4 text-right font-semibold text-xl text-gray-700">
        Total Expenses: {totalExpenses(expenses)}
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
