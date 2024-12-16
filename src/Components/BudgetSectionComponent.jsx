import PropTypes from 'prop-types';

const BudgetSectionComponent = ({
  budgetUserData,
  formatCurrency,
  handleEditBudget,
  setBudgetToEdit,
  setIsEditingBudget
}) => {
  const isBudgetEmpty = 
    !budgetUserData.monthly_income_goal &&
    !budgetUserData.monthly_expense_goal &&
    !budgetUserData.actual_income &&
    !budgetUserData.actual_expenses;

    console.log('budgetUserData:', budgetUserData);

    const handleCreateBudget = () => {
      const initialBudget = {
        monthly_income_goal: 0,
        monthly_expense_goal: 0,
        actual_income: 0,
        actual_expenses: 0,
      };
    
      setBudgetToEdit(initialBudget); 
      setIsEditingBudget(true); 
    };
    

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Budget</h2>
      {budgetUserData ? (
        <div>
          {/* Display Budget Details */}
          <p className="text-gray-600">
            Income Goal: <strong className="text-green-600">{formatCurrency(budgetUserData.monthly_income_goal)}</strong>
          </p>
          <p className="text-gray-600">
            Expense Goal: <strong className="text-red-600">{formatCurrency(budgetUserData.monthly_expense_goal)}</strong>
          </p>
          <p className="text-gray-600">
            Actual Income: <strong className="text-green-600">{formatCurrency(budgetUserData.actual_income)}</strong>
          </p>
          <p className="text-gray-600">
            Actual Expenses: <strong className="text-red-600">{formatCurrency(budgetUserData.actual_expenses)}</strong>
          </p>
          <p className="text-gray-600">
            Disposable Income: <strong className="text-blue-600">{formatCurrency(budgetUserData.disposable_income)}</strong>
          </p>
          {/* Create or Update Budget Button */}
          {isBudgetEmpty ? (
            <button 
              className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition-colors"
              onClick={handleCreateBudget}
            >
              Create Budget
            </button>
          ) : (
            <button 
              className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => handleEditBudget(budgetUserData)}
            >
              Update Budget
            </button>
          )}
        </div>
      ) : (
        <p className="text-gray-500">No budget data available.</p>
      )}
    </div>
  );
};

BudgetSectionComponent.propTypes = {
  budgetUserData: PropTypes.shape({
    budget_id: PropTypes.string.isRequired,
    monthly_income_goal: PropTypes.number.isRequired,
    monthly_expense_goal: PropTypes.number.isRequired,
    actual_income: PropTypes.number.isRequired,
    actual_expenses: PropTypes.number.isRequired,
    disposable_income: PropTypes.number.isRequired,
  }),
  formatCurrency: PropTypes.func.isRequired,
  createBudget: PropTypes.func.isRequired,
  newMonthlyIncomeGoal: PropTypes.number,
  newMonthlyExpenseGoal: PropTypes.number,
  newActualIncome: PropTypes.number,
  newActualExpenses: PropTypes.number,
  handleEditBudget: PropTypes.func.isRequired,
  setBudgetToEdit: PropTypes.func.isRequired,
  setIsEditingBudget: PropTypes.func.isRequired,
};

export default BudgetSectionComponent;
