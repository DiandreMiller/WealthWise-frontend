import PropTypes from 'prop-types';

const IncomeSectionComponent = ({
  isAddingIncome,
  incomeDescription,
  setIncomeDescription,
  incomeAmount,
  setIncomeAmount,
  addIncome,
  setIsAddingIncome,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Income</h2>
      {isAddingIncome ? (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Income Source"
            value={incomeDescription}
            onChange={(e) => setIncomeDescription(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            placeholder="Amount"
            value={incomeAmount}
            onChange={(e) => setIncomeAmount(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex space-x-4">
            <button
              className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition-colors"
              onClick={addIncome}
            >
              Add
            </button>
            <button
              className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition-colors"
              onClick={() => setIsAddingIncome(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => setIsAddingIncome(true)}
        >
          Add Income
        </button>
      )}
    </div>
  );
};

IncomeSectionComponent.propTypes = {
  isAddingIncome: PropTypes.bool.isRequired,
  incomeDescription: PropTypes.string.isRequired,
  setIncomeDescription: PropTypes.func.isRequired,
  incomeAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setIncomeAmount: PropTypes.func.isRequired,
  addIncome: PropTypes.func.isRequired,
  setIsAddingIncome: PropTypes.func.isRequired,
};

export default IncomeSectionComponent;
