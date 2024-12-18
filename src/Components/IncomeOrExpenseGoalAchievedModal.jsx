import PropTypes from 'prop-types';

const IncomeOrExpenseGoalAchievedModal = ({ onClose, 
  checkIfIncomeOrExpenseAchieved, budgetUserData, userData, expenseUser, handleEditBudget  }) => {
    
    const goalAchieved = checkIfIncomeOrExpenseAchieved(budgetUserData,
      budgetUserData,
      userData,
      expenseUser
    );

    const handleYesClick = () => {
      onClose();
      setTimeout(() => handleEditBudget(budgetUserData), 100); 
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h1 className="text-xl font-semibold text-green-600 mb-2 text-center">
          🎉 Congrats on Hitting Your {goalAchieved} Goal!
        </h1>
        <h2 className="text-gray-700 text-lg text-center mb-6">
          Would you like to update your goals?
        </h2>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleYesClick}
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

IncomeOrExpenseGoalAchievedModal.propTypes = {
    onClose: PropTypes.func.isRequired, 
    onUpdateGoals: PropTypes.func.isRequired, 
    checkIfIncomeOrExpenseAchieved: PropTypes.func.isRequired,
    budgetUserData: PropTypes.object.isRequired,
    userData: PropTypes.array.isRequired,
    expenseUser: PropTypes.object.isRequired,
  };

export default IncomeOrExpenseGoalAchievedModal;
