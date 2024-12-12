import PropTypes from 'prop-types';
import { useState } from 'react';

const ExpenseEditModal = ({ expense, onClose, onSubmit }) => {
  const [newAmount, setNewAmount] = useState(Number(expense.amount));
  const [newCategory, setNewCategory] = useState(expense.category); 

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(expense.id, newAmount, newCategory);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-black text-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Edit Expense</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="category" className="block">Category</label>
            <input
              type="text"
              id="category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full border border-white bg-black text-white rounded-lg p-2 mt-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block">Expense Amount</label>
            <input
              type="number"
              id="amount"
              value={newAmount}
              onChange={(e) => setNewAmount(parseFloat(e.target.value))}
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

ExpenseEditModal.propTypes = {
  expense: PropTypes.shape({
    id: PropTypes.string.isRequired,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    category: PropTypes.string.isRequired,  
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ExpenseEditModal;
