import PropTypes from 'prop-types'; 

const SpecificMonthExpenseComponent = ({ currentMonth, currentMonthExpenses }) => {

    return (
        <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-md hover:bg-red-50 transition-colors">
            <h3 className="text-lg font-semibold text-gray-700">
                {currentMonth}'s Expenses
            </h3>
            <p className="text-gray-600 mt-2">
                Track all your expenses for {currentMonth}.
            </p>
            <div className="mt-4">
                <p className="text-2xl font-bold text-red-600">
                    ${currentMonthExpenses}
                </p>
            </div>
        </div>
    );

};

SpecificMonthExpenseComponent.propTypes = {
    currentMonth: PropTypes.string.isRequired, 
    currentMonthExpenses: PropTypes.number.isRequired, 
};

export default SpecificMonthExpenseComponent;