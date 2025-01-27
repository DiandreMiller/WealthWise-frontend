import PropTypes from 'prop-types'; 
import { useState, useEffect } from 'react';
import CurrentMonthChartIncomeModal from "../CurrentMonthIncomeChartModal";

const SpecificMonthIncomeComponent = ({ currentMonth, currentMonthIncome, filteredIncome, getPreviousMonth, previousMonthIncome, darkMode }) => {
    const [showIncomeChart, setShowIncomeChart] = useState(false);
    const [incomeComparison, setIncomeComparison] = useState({ percentage: 0, isIncomeMore: null });

    const toggleChart = () => {
        setShowIncomeChart((previous) => !previous);
    }

    // Calculate percentage income gained compared to previous month
    useEffect(() => {

        const calculateIncomeComparison = () => {

                if(!currentMonthIncome || !previousMonthIncome || previousMonthIncome === 0) {
                    setIncomeComparison({ percentage: 0, isIncomeMore: null });
                    return;
                }

                const difference = currentMonthIncome - previousMonthIncome;
                const percentage = Math.abs((difference / previousMonthIncome) * 100).toFixed(2);
                const isIncomeMore = difference > 0;
            
                setIncomeComparison({ percentage, isIncomeMore });
        }

        calculateIncomeComparison()

    }, [currentMonthIncome, previousMonthIncome])
    

    return (
        <div
            className={`group p-4 rounded-lg shadow-md border transition-colors hover:bg-green-50 ${
                darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
            }`}>
            <h3
                className={`text-lg font-semibold transition-colors ${
                    darkMode ? 'text-white group-hover:text-black' : 'text-gray-700 group-hover:text-black'
                }`}>
                {currentMonth}'s Income
            </h3>
            <p
                className={`mt-2 transition-colors ${
                    darkMode ? 'text-gray-400 group-hover:text-black' : 'text-gray-600 group-hover:text-black'
                }`}>
                View your total income for {currentMonth}.
            </p>
            <div className="mt-4">
                <p className="text-2xl font-bold text-green-600">
                    ${currentMonthIncome.toFixed(2)}
                </p>
            </div>
    
            <button
                className="mt-4 bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                onClick={toggleChart}>
                {showIncomeChart ? "Hide Chart" : "View Chart"}
            </button>

            {showIncomeChart && (
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
                            {currentMonth}'s Income Chart
                        </h2>
                        <CurrentMonthChartIncomeModal
                            currentMonth={currentMonth}
                            currentMonthIncome={currentMonthIncome}
                            filteredIncome={filteredIncome}
                            getPreviousMonth={getPreviousMonth}
                            previousMonthIncome={previousMonthIncome}
                            incomeComparedToLastMonth={incomeComparison.percentage}
                            isIncomeMore={incomeComparison.isIncomeMore}
                        />
                    </div>
                </div>
            )}
        </div>
    );
    
    
    

};

SpecificMonthIncomeComponent.propTypes = {
    currentMonth: PropTypes.string.isRequired,
    currentMonthIncome: PropTypes.number.isRequired,
    filteredIncome: PropTypes.arrayOf(PropTypes.shape({
        category: PropTypes.string.isRequired,
        amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    })).isRequired,
    getPreviousMonth: PropTypes.string.isRequired,
    previousMonthIncome: PropTypes.number.isRequired,
    darkMode: PropTypes.func.isRequired,
};

export default SpecificMonthIncomeComponent;

