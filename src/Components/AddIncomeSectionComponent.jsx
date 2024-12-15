import PropTypes from 'prop-types';

const AddIncomeSectionComponent = ({
  userData,
  formatCurrency,
  totalIncome,
  setIncomeToEdit,
  setIsEditingIncome,
  deleteIncome,
  showAllIncome,
  setShowAllIncome,
}) => {

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6 border border-gray-200">
         <h2 className="text-xl font-semibold text-gray-700 mb-4">Added Incomes</h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Source</th>
                <th className="border border-gray-300 px-4 py-2 text-right text-gray-600">Income</th>
                <th className="border border-gray-300 px-4 py-2 text-center text-gray-600">Date Received</th>
                <th className="border border-gray-300 px-4 py-2 text-center text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
                {userData.length > 0 ? (
                    userData
                    .slice()
                    .reverse()
                    .slice(0, showAllIncome ? userData.length : 4)
                    .map((income) => (
                        <tr key={income.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 text-gray-800">{income.source}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right text-gray-800">
                            {formatCurrency(income.amount)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center text-gray-800">
                            {income.date_received}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                            <button
                            className="text-sm bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-colors mr-2"
                            onClick={() => {
                                setIncomeToEdit(income);
                                setIsEditingIncome(true);
                            }}
                            >
                            Edit
                            </button>
                            <button
                            className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                            onClick={() => deleteIncome(income.id)}
                            >
                            Delete
                            </button>
                        </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan="4" className="text-center text-gray-500">
                        No incomes to display. Add Your Incomes!
                    </td>
                    </tr>
                )}
            </tbody>
          </table>
      <div className="mt-4 text-right font-semibold text-xl text-gray-700">
       Total Income: {totalIncome(userData)}
     </div>
  <button
    className="mt-4 text-blue-500 hover:underline"
    onClick={() => setShowAllIncome((prevState) => !prevState)}
  >
    {showAllIncome ? "See Less" : "See More"}
  </button>
    </div>
  );
};

AddIncomeSectionComponent.propTypes = {
  userData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      source: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date_received: PropTypes.string.isRequired,
    })
  ).isRequired,
  formatCurrency: PropTypes.func.isRequired,
  totalIncome: PropTypes.func.isRequired,
  setIncomeToEdit: PropTypes.func.isRequired,
  setIsEditingIncome: PropTypes.func.isRequired,
  deleteIncome: PropTypes.func.isRequired,
  showAllIncome: PropTypes.bool.isRequired,
  setShowAllIncome: PropTypes.func.isRequired,
};

export default AddIncomeSectionComponent;
