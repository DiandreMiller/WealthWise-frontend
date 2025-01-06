import PropTypes from 'prop-types';
import { useState } from 'react';

const IncomeEditModal = ({ income, onClose, onSubmit }) => {
  const [newAmount, setNewAmount] = useState(income.amount);
  const [newSource, setNewSource] = useState(income.source);
  const [newCategory, setNewCategory] = useState(income.category || "");
  const [isRecurring, setIsRecurring] = useState(income.is_recurring);

  const incomeCategories = [
    'salary',
    'rental',
    'investments',
    'business',
    'pension',
    'social security',
    'royalties',
    'government assistance',
    'gifts',
    'bonus',
    'inheritance',
    'lottery/gambling',
    'gigs',
    'asset sales',
    'tax refunds',
    'severance pay',
    'grants/scholarships',
    'other',
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(income.id, newAmount, newSource, newCategory, isRecurring);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-black text-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Edit Income</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="source" className="block">
              Source
            </label>
            <input
              type="text"
              id="source"
              value={newSource}
              onChange={(event) => setNewSource(event.target.value)}
              className="w-full border border-white bg-black text-white rounded-lg p-2 mt-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block">
              Income Amount
            </label>
            <input
              type="number"
              id="amount"
              value={newAmount}
              onChange={(event) => setNewAmount(event.target.value)}
              className="w-full border border-white bg-black text-white rounded-lg p-2 mt-2"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block">
              Category
            </label>
            <select
              id="category"
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
              className="w-full border border-white bg-black text-white rounded-lg p-2 mt-2"
            >
              <option value="" disabled>
                Select a category
              </option>
              {incomeCategories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="isRecurring" className="block">
              Is Recurring
            </label>
            <select
              id="isRecurring"
              value={isRecurring ? "Yes" : "No"}
              onChange={(event) => setIsRecurring(event.target.value === "Yes")}
              className="w-full border border-white bg-black text-white rounded-lg p-2 mt-2"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
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

IncomeEditModal.propTypes = {
  income: PropTypes.shape({
    id: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    source: PropTypes.string.isRequired,
    category: PropTypes.string,
    is_recurring: PropTypes.bool,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default IncomeEditModal;
