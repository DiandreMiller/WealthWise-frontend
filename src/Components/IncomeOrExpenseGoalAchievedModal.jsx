import PropTypes from 'prop-types';

const IncomeOrExpenseGoalAchievedComponent = ({ onClose, onUpdateGoals, 
  checkIfIncomeOrExpenseAchieved, budgetUserData, userData, expenseUser,  }) => {
    

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h1 className="text-xl font-semibold text-green-600 mb-2 text-center">
          🎉 Congrats on Hitting Your {checkIfIncomeOrExpenseAchieved(budgetUserData, budgetUserData, userData, expenseUser)} Goal!
        </h1>
        <h2 className="text-gray-700 text-lg text-center mb-6">
          Would you like to update your goals?
        </h2>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onUpdateGoals}
            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-200"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition duration-200"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

IncomeOrExpenseGoalAchievedComponent.propTypes = {
    onClose: PropTypes.func.isRequired, 
    onUpdateGoals: PropTypes.func.isRequired, 
  };

export default IncomeOrExpenseGoalAchievedComponent;
