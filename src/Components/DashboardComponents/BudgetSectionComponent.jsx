import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';


const BudgetSectionComponent = ({
  budgetUserData,
  formatCurrency,
  handleEditBudget,
  setBudgetToEdit,
  setIsEditingBudget,
  expenseUser,
  userData,
  darkMode
}) => {

  // console.log("Rendering with budgetUserData:", budgetUserData);


  const [disposableIncome, setDisposableIncome] = useState(0);

  useEffect(() => {

    if (userData.length > 0 && expenseUser.expenses.length > 0) {
        const finalIncome = userData.map((person) => Number(person.amount)).reduce((a,b) => a + b, 0);
        // console.log('finalIncome:', finalIncome);
        const finalExpense = expenseUser.expenses.map((person) => Number(person.amount)).reduce((a,b) => a + b, 0);
        // console.log('finalExpense:', finalExpense);
        const moneyToSpend = Number((finalIncome - finalExpense)).toFixed(2);
        // console.log('moneyToSpend:', moneyToSpend);
        setDisposableIncome(moneyToSpend);
        // console.log("Calculated Disposable Income:", disposableIncome);

    } else {
      setDisposableIncome(0);
    }

  },[expenseUser, userData, budgetUserData])


  const isBudgetEmpty = 
    !budgetUserData.monthly_income_goal &&
    !budgetUserData.monthly_expense_goal &&
    !budgetUserData.actual_income &&
    !budgetUserData.actual_expenses;


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
    <div  className={`shadow-lg rounded-lg p-6 border ${
      darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <h2 className={`text-xl  mb-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-700'}`}>Budget</h2>
      {budgetUserData ? (
        <div>
          {/* Display Budget Details */}
          <p className={`${darkMode ? 'text-white' : 'text-gray-700'}`}>
            Income Goal: <strong className="text-green-600">{formatCurrency(budgetUserData.monthly_income_goal)}</strong>
          </p>
          <p className={`${darkMode ? 'text-white' : 'text-gray-700'}`}>
            Expense Goal: <strong className="text-red-600">{formatCurrency(budgetUserData.monthly_expense_goal)}</strong>
          </p>
          <p className={`${darkMode ? 'text-white' : 'text-gray-700'}`}>
            Actual Income: <strong className="text-green-600">
              {formatCurrency(
                userData.reduce((a, b) => a + b.amount, 0)
              )}
            </strong>
          </p>

          <p className={`${darkMode ? 'text-white' : 'text-gray-700'}`}>
            Actual Expenses: <strong className="text-red-600">{formatCurrency(
                expenseUser.expenses.reduce((a,b) => a + b.amount, 0)
            )}</strong>
          </p>
          <p className={`${darkMode ? 'text-white' : 'text-gray-700'} mb-4`}>
            Disposable Income: <strong className="text-blue-600">{formatCurrency(disposableIncome)}</strong>
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
  handleEditBudget: PropTypes.func.isRequired,
  setBudgetToEdit: PropTypes.func.isRequired,
  setIsEditingBudget: PropTypes.func.isRequired,
  expenseUser: PropTypes.shape({
    expenses: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      })
    ).isRequired,
  }).isRequired,
  userData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ).isRequired,
  darkMode: PropTypes.func.isRequired,
};

export default BudgetSectionComponent;
