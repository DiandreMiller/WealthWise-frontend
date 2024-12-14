import PropTypes from 'prop-types';

const BudgetSectionComponent = ({
    isAddingBudget,
    budgetName,
    setBudgetName,
    budgetAmount,
    setBudgetAmount,
    addBudget,
    setIsAddingBudget,
    userData,
    formatCurrency,
    updateBudget,
    createBudget,
    newMonthlyIncomeGoal,
    newMonthlyExpenseGoal,
    newActualIncome,
    newActualExpenses,
}) => {

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Budget</h2>
            {userData?.budget ? (
                <div>
                    <p className="text-gray-600">
                        Income Goal: <strong className="text-green-600">{formatCurrency(userData.budget.monthly_income_goal)}</strong>
                    </p>
                    <p className="text-gray-600">
                        Expense Goal: <strong className="text-red-600">{formatCurrency(userData.budget.monthly_expense_goal)}</strong>
                    </p>
                    <p className="text-gray-600">
                        Actual Income: <strong className="text-green-600">{formatCurrency(userData.budget.actual_income)}</strong>
                    </p>
                    <p className="text-gray-600">
                        Actual Expenses: <strong className="text-red-600">{formatCurrency(userData.budget.actual_expenses)}</strong>
                    </p>
                    <button
                        className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 mt-4 transition-colors"
                        onClick={() => updateBudget(userData.budget.id, {
                            monthlyIncomeGoal: newMonthlyIncomeGoal,
                            monthlyExpenseGoal: newMonthlyExpenseGoal,
                            actualIncome: newActualIncome,
                            actualExpenses: newActualExpenses,
                        })}
                    >
                        Update Budget
                    </button>
                </div>
            ) : (
                <button
                    className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    onClick={() => createBudget({
                        monthlyIncomeGoal: newMonthlyIncomeGoal,
                        monthlyExpenseGoal: newMonthlyExpenseGoal,
                        actualIncome: newActualIncome,
                        actualExpenses: newActualExpenses,
                    })}
                >
                    Create Budget
                </button>
            )}
        </div>
    );
};

BudgetSectionComponent.propTypes = {
    isAddingBudget: PropTypes.bool.isRequired,
    budgetName: PropTypes.string,
    setBudgetName: PropTypes.func,
    budgetAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    setBudgetAmount: PropTypes.func,
    addBudget: PropTypes.func,
    setIsAddingBudget: PropTypes.func,
    userData: PropTypes.shape({
        budget: PropTypes.shape({
            id: PropTypes.string.isRequired,
            monthly_income_goal: PropTypes.number.isRequired,
            monthly_expense_goal: PropTypes.number.isRequired,
            actual_income: PropTypes.number.isRequired,
            actual_expenses: PropTypes.number.isRequired,
        }),
    }),
    formatCurrency: PropTypes.func.isRequired,
    updateBudget: PropTypes.func.isRequired,
    createBudget: PropTypes.func.isRequired,
    newMonthlyIncomeGoal: PropTypes.number,
    newMonthlyExpenseGoal: PropTypes.number,
    newActualIncome: PropTypes.number,
    newActualExpenses: PropTypes.number,
};

export default BudgetSectionComponent;
