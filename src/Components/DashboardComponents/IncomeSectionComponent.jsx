import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

const IncomeSectionComponent = ({
  isAddingIncome,
  incomeDescription,
  setIncomeDescription,
  incomeAmount,
  setIncomeAmount,
  incomeCategory,
  setIncomeCategory,
  addIncome,
  setIsAddingIncome,
  isRecurringIncome,
  setIsRecurringIncome
}) => {
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
    'other'
  ];

  const handleDescriptionChange = (event) => {
    const sanitizedDescription = DOMPurify.sanitize(event.target.value);
    setIncomeDescription(sanitizedDescription);
  }

  const handleAmountChange = (event) => {
    const sanitizedAmount = DOMPurify.sanitize(event.target.value);
    setIncomeAmount(sanitizedAmount);
  }

  

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Income</h2>
      {isAddingIncome ? (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Income Source"
            value={incomeDescription}
            onChange={handleDescriptionChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            placeholder="Amount"
            value={incomeAmount}
            onChange={handleAmountChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          
          <div>
            <select
              value={incomeCategory === null ? "" : incomeCategory}
              onChange={(event) => {
                const selectedCategory = event.target.value === "" ? null : event.target.value;
                // console.log("Selected category in dropdown:", selectedCategory);
                setIncomeCategory(selectedCategory);
              }}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              id="dropdown">
              <option value="" disabled>
                Select an income category
              </option>
              {incomeCategories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div> 


          <div>
              <select
                value={isRecurringIncome === null ? "" : isRecurringIncome ? "Yes" : "No"}
                onChange={(event) => {
                  const selectedValue = event.target.value === "Yes" ? true : event.target.value === "No" ? false : null;
                  // console.log("Is recurring income:", selectedValue);
                  setIsRecurringIncome(selectedValue);
                }}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                id="dropdown">
                <option value="" disabled>
                  Is this income recurring?
                </option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
          </div>



          <div className="flex space-x-4">
            <button
              className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition-colors"
              onClick={() => {
                // console.log("Adding income with the following details:");
                // console.log("Description:", incomeDescription);
                // console.log("Amount:", incomeAmount);
                // console.log("Category:", incomeCategory);
                addIncome();
              }}
            >
              Add
            </button>
            <button
              className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition-colors"
              onClick={() => {
                // console.log("Cancelled adding income.");
                setIsAddingIncome(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => {
            // console.log("Clicked 'Add Income' button.");
            setIsAddingIncome(true);
          }}
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
  incomeCategory: PropTypes.string.isRequired,
  setIncomeCategory: PropTypes.func.isRequired,
  addIncome: PropTypes.func.isRequired,
  setIsAddingIncome: PropTypes.func.isRequired,
  isRecurringIncome: PropTypes.bool.isRequired,
  setIsRecurringIncome: PropTypes.func.isRequired,
};

export default IncomeSectionComponent;
