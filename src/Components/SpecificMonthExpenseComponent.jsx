const SpecificMonthExpenseComponent = () => {

    return (
        <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-md hover:bg-red-50 transition-colors">
            <h3 className="text-lg font-semibold text-gray-700">
                December's Expenses
            </h3>
            <p className="text-gray-600 mt-2">
                Track all your expenses for the current month.
            </p>
            <div className="mt-4">
                <p className="text-2xl font-bold text-red-600">
                    $1,250.00
                </p>
            </div>
        </div>
    );
    
};

export default SpecificMonthExpenseComponent;