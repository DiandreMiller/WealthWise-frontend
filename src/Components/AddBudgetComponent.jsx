import PropTypes from 'prop-types';
import { useState } from 'react';

const AddBudgetSectionComponent = ({ createBudget }) => {
  const [monthlyIncomeGoal, setMonthlyIncomeGoal] = useState('');
  const [monthlyExpenseGoal, setMonthlyExpenseGoal] = useState('');
  const [actualIncome, setActualIncome] = useState('');
  const [actualExpenses, setActualExpenses] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (
      isNaN(monthlyIncomeGoal) ||
      isNaN(monthlyExpenseGoal) ||
      isNaN(actualIncome) ||
      isNaN(actualExpenses) ||
      monthlyIncomeGoal <= 0 ||
      monthlyExpenseGoal <= 0 ||
      actualIncome < 0 ||
      actualExpenses < 0
    ) {
      alert('Please enter valid positive numbers for all fields.');
      return;
    }

    setLoading(true);

    try {
      await createBudget({
        monthlyIncomeGoal: parseFloat(monthlyIncomeGoal),
        monthlyExpenseGoal: parseFloat(monthlyExpenseGoal),
        actualIncome: parseFloat(actualIncome),
        actualExpenses: parseFloat(actualExpenses),
      });
      // Reset form fields after successful submission
      setMonthlyIncomeGoal('');
      setMonthlyExpenseGoal('');
      setActualIncome('');
      setActualExpenses('');
    } catch (error) {
      console.error('Error adding budget:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Budget</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="monthlyIncomeGoal"
            className="block text-gray-700 font-medium mb-2"
          >
            Monthly Income Goal
          </label>
          <input
            type="number"
            id="monthlyIncomeGoal"
            value={monthlyIncomeGoal}
            onChange={(e) => setMonthlyIncomeGoal(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter your monthly income goal"
            required
          />
        </div>
        <div>
          <label
            htmlFor="monthlyExpenseGoal"
            className="block text-gray-700 font-medium mb-2"
          >
            Monthly Expense Goal
          </label>
          <input
            type="number"
            id="monthlyExpenseGoal"
            value={monthlyExpenseGoal}
            onChange={(e) => setMonthlyExpenseGoal(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter your monthly expense goal"
            required
          />
        </div>
        <div>
          <label
            htmlFor="actualIncome"
            className="block text-gray-700 font-medium mb-2"
          >
            Actual Income
          </label>
          <input
            type="number"
            id="actualIncome"
            value={actualIncome}
            onChange={(e) => setActualIncome(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter your actual income"
            required
          />
        </div>
        <div>
          <label
            htmlFor="actualExpenses"
            className="block text-gray-700 font-medium mb-2"
          >
            Actual Expenses
          </label>
          <input
            type="number"
            id="actualExpenses"
            value={actualExpenses}
            onChange={(e) => setActualExpenses(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter your actual expenses"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
            loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Add Budget'}
        </button>
      </form>
    </div>
  );
};

AddBudgetSectionComponent.propTypes = {
  createBudget: PropTypes.func.isRequired,
};

export default AddBudgetSectionComponent;
