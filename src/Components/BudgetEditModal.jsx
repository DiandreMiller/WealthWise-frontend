import PropTypes from 'prop-types';
import { useState } from 'react';

const BudgetEditModal = ({ budget, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    monthly_income_goal: budget?.monthly_income_goal || 0,
    monthly_expense_goal: budget?.monthly_expense_goal || 0,
    actual_income: budget?.actual_income || 0,
    actual_expenses: budget?.actual_expenses || 0,
  });

  console.log("Budget passed to BudgetEditModal:", budget);


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value === "" ? 0 : parseFloat(value),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form data before submitting:", formData);
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-black text-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Edit Budget</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="monthly_income_goal" className="block">Monthly Income Goal</label>
            <input
              type="number"
              id="monthly_income_goal"
              value={formData.monthly_income_goal || ""}
              onChange={handleChange}
              className="w-full border border-white bg-black text-white rounded-lg p-2 mt-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="monthly_expense_goal" className="block">Monthly Expense Goal</label>
            <input
              type="number"
              id="monthly_expense_goal"
              value={formData.monthly_expense_goal || ""}
              onChange={handleChange}
              className="w-full border border-white bg-black text-white rounded-lg p-2 mt-2"
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

BudgetEditModal.propTypes = {
  budget: PropTypes.shape({
    monthly_income_goal: PropTypes.number.isRequired,
    monthly_expense_goal: PropTypes.number.isRequired,
    actual_income: PropTypes.number.isRequired,
    actual_expenses: PropTypes.number.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};


export default BudgetEditModal;
