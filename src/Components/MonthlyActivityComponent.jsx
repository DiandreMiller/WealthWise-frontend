import PropTypes from 'prop-types'; 
import SpecificMonthExpenseComponent from "./SpecificMonthExpenseComponent";
import SpecificMonthIncomeComponent from "./SpecificMonthIncomeComponent";

const MonthlyActivityComponent = ({ currentMonth, currentMonthIncome, currentMonthExpenses }) => {


    // console.log('current month:', currentMonth);
    return (
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                {currentMonth}'s Activity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SpecificMonthIncomeComponent currentMonth={currentMonth} 
                    currentMonthIncome={currentMonthIncome} 
                    />
                <SpecificMonthExpenseComponent currentMonth={currentMonth} 
                    currentMonthExpenses={currentMonthExpenses}
                />
            </div>
        </div>
    );

};

MonthlyActivityComponent.propTypes = {
    currentMonth: PropTypes.string.isRequired, 
    currentMonthIncome: PropTypes.number.isRequired, 
    currentMonthExpenses: PropTypes.number.isRequired, 
};

export default MonthlyActivityComponent;
