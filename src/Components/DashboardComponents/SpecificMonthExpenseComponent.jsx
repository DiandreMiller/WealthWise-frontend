import PropTypes from 'prop-types';
import { useState } from 'react';
import CurrentMonthExpenseChartModal from '../CurrentMonthExpenseChartModal'


const SpecificMonthExpenseComponent = ({ currentMonth, currentMonthExpenses, filteredExpense, getPreviousMonth}) => {
    const [showExpenseChart, setShowExpenseChart] = useState(false);

    const toggleChart = () => {
        setShowExpenseChart((previous) => !previous);
    }

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

            <button
                    className="mt-4 bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={toggleChart}>
                    {showExpenseChart ? "Hide Chart" : "View Chart"}
            </button>

            {showExpenseChart && (
                <div
                    className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
                    onClick={toggleChart} 
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg"
                        onClick={(event) => event.stopPropagation()} 
                    >
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                            onClick={toggleChart}
                        >
                            &times;
                        </button>
                        <h2 className="text-lg font-semibold mb-4">
                            {currentMonth}'s Expense Chart
                        </h2>
                        <CurrentMonthExpenseChartModal 
                             currentMonth={currentMonth}
                             currentMonthExpenses={currentMonthExpenses}
                             filteredExpense={filteredExpense}
                             getPreviousMonth={getPreviousMonth}
                        />
                    </div>
                </div>
            )}
        </div>
    );

};

SpecificMonthExpenseComponent.propTypes = {
    currentMonth: PropTypes.string.isRequired, 
    currentMonthExpenses: PropTypes.number.isRequired, 
    filteredExpense: PropTypes.array.isRequired,
    getPreviousMonth: PropTypes.string.isRequired
};

export default SpecificMonthExpenseComponent;