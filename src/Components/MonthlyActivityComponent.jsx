import SpecificMonthExpenseComponent from "./SpecificMonthExpenseComponent";
import SpecificMonthIncomeComponent from "./SpecificMonthIncomeComponent";

const MonthlyActivityComponent = () => {

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Monthly Activity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SpecificMonthIncomeComponent />
                <SpecificMonthExpenseComponent />
            </div>
        </div>
    );
    
};

export default MonthlyActivityComponent;
