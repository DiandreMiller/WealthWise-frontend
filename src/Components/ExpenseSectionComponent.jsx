import PropTypes from 'prop-types';

const ExpenseSectionComponent = ({ isAddingExpense, expenseDescription, setExpenseDescription,
    expenseAmount, setExpenseAmount, addExpense, setIsAddingExpense }) => {

return (

        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Expenses</h2>
            {isAddingExpense ? (
                <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Expense Description"
                    value={expenseDescription}
                    onChange={(e) => setExpenseDescription(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="flex space-x-4">
                    <button
                    className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    onClick={addExpense}
                    >
                    Add
                    </button>
                    <button
                    className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition-colors"
                    onClick={() => setIsAddingExpense(false)}
                    >
                    Cancel
                    </button>
                </div>
                </div>
            ) : (
                <button
                className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => setIsAddingExpense(true)}
                >
                Add Expense
                </button>
            )}

        </div>
    )

}

ExpenseSectionComponent.propTypes = {
    isAddingExpense: PropTypes.bool.isRequired,
    expenseDescription: PropTypes.string.isRequired,
    setExpenseDescription: PropTypes.func.isRequired,
    expenseAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    setExpenseAmount: PropTypes.func.isRequired,
    addExpense: PropTypes.func.isRequired,
    setIsAddingExpense: PropTypes.func.isRequired,
}

export default ExpenseSectionComponent;