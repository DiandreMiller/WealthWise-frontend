import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import CurrentMonthExpenseChartModal from '../CurrentMonthExpenseChartModal';

const SpecificMonthExpenseComponent = ({
    currentMonth,
    currentMonthExpenses,
    filteredExpense,
    getPreviousMonth,
    previousMonthExpenses,
    thisMonthExpensesEntries,
    darkMode,
}) => {
    const [showExpenseChart, setShowExpenseChart] = useState(false);
    const [spendingComparison, setSpendingComparison] = useState({ percentage: 0, isSpendingMore: null });

    const toggleChart = () => {
        setShowExpenseChart(prev => !prev);
    };

    // Calculate percentage spent compared to the previous month
    useEffect(() => {
        const calculateSpendingComparison = () => {
            if (!currentMonthExpenses || !previousMonthExpenses || previousMonthExpenses === 0) {
                setSpendingComparison({ percentage: 0, isSpendingMore: null });
                return;
            }

            const difference = currentMonthExpenses - previousMonthExpenses;
            const percentage = Math.abs((difference / previousMonthExpenses) * 100).toFixed(2);
            const isSpendingMore = difference > 0;

            setSpendingComparison({ percentage, isSpendingMore });
        };

        calculateSpendingComparison();
    }, [currentMonthExpenses, previousMonthExpenses]);

    return (
        <div
            className={`group p-4 rounded-lg shadow-md border transition-colors hover:bg-red-50 ${
                darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
            }`}>
            <h3
                className={`text-lg font-semibold transition-colors ${
                    darkMode ? 'text-white group-hover:text-black' : 'text-gray-700 group-hover:text-black'
                }`}>
                {currentMonth}'s Expenses
            </h3>
            <p
                className={`mt-2 transition-colors ${
                    darkMode ? 'text-gray-400 group-hover:text-black' : 'text-gray-600 group-hover:text-black'
                }`}>
                Track all your expenses for {currentMonth}.
            </p>
            <div className="mt-4">
                <p className="text-2xl font-bold text-red-600">
                    ${Number(currentMonthExpenses.toFixed(2)) + thisMonthExpensesEntries}
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
                    onClick={toggleChart}>
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg"
                        onClick={(event) => event.stopPropagation()}>
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                            onClick={toggleChart}>
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
                            previousMonthExpenses={previousMonthExpenses}
                            spendingComparedToLastMonth={spendingComparison.percentage}
                            isSpendingMore={spendingComparison.isSpendingMore}
                            darkMode={darkMode}
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
    filteredExpense: PropTypes.arrayOf(
        PropTypes.shape({
            category_type: PropTypes.string.isRequired,
            amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        })
    ).isRequired,
    getPreviousMonth: PropTypes.string.isRequired,
    previousMonthExpenses: PropTypes.number.isRequired,
    darkMode: PropTypes.func.isRequired,
};

export default SpecificMonthExpenseComponent;
