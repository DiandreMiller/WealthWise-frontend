import PropTypes from 'prop-types'; 
import SpecificMonthExpenseComponent from "./DashboardComponents/SpecificMonthExpenseComponent";
import SpecificMonthIncomeComponent from "./DashboardComponents/SpecificMonthIncomeComponent";

const MonthlyActivityComponent = ({ currentMonth, currentMonthIncome,thisMonthIncomeEntries, currentMonthExpenses, 
    filteredIncome, filteredExpense, thisMonthExpensesEntries, getPreviousMonth, 
    previousMonthExpenses, previousMonthIncome, darkMode}) => {


    return (
        <div className={`shadow-lg rounded-lg p-6 border border-gray-200 ${
      darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    }`}>
            <h2 className={`text-2xl font-bold mb-4 text-center ${darkMode ? 'text-white': 'text-gray-800'}`}>
                {currentMonth}'s Activity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SpecificMonthIncomeComponent currentMonth={currentMonth} 
                    currentMonthIncome={currentMonthIncome} 
                    filteredIncome={filteredIncome}
                    getPreviousMonth={getPreviousMonth}
                    previousMonthIncome={previousMonthIncome}
                    darkMode={darkMode}
                    thisMonthIncomeEntries={thisMonthIncomeEntries}
                    />
                <SpecificMonthExpenseComponent currentMonth={currentMonth} 
                    currentMonthExpenses={currentMonthExpenses}
                    filteredExpense={filteredExpense}
                    getPreviousMonth={getPreviousMonth}
                    previousMonthExpenses={previousMonthExpenses}
                    thisMonthExpensesEntries={thisMonthExpensesEntries}
                    darkMode={darkMode}
                />
            </div>
        </div>
    );

};

MonthlyActivityComponent.propTypes = {
    currentMonth: PropTypes.string.isRequired, 
    currentMonthIncome: PropTypes.number.isRequired, 
    currentMonthExpenses: PropTypes.number.isRequired, 
    thisMonthIncomeEntries: PropTypes.number.isRequired,
    getPreviousMonth: PropTypes.string.isRequired,
    previousMonthIncome: PropTypes.number.isRequired,
    previousMonthExpenses: PropTypes.number.isRequired,
    thisMonthExpensesEntries: PropTypes.number.isRequired,
    filteredIncome: PropTypes.array.isRequired,
    filteredExpense: PropTypes.array.isRequired,
    darkMode: PropTypes.func.isRequired,
};

export default MonthlyActivityComponent;
