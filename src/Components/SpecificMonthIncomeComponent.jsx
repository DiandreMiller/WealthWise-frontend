const SpecificMonthIncomeComponent = () => {

    return (
        <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-md hover:bg-green-50 transition-colors">
            <h3 className="text-lg font-semibold text-gray-700">
                December's Income
            </h3>
            <p className="text-gray-600 mt-2">
                View your total income for the current month.
            </p>
            <div className="mt-4">
                <p className="text-2xl font-bold text-green-600">
                    $3,500.00
                </p>
            </div>
        </div>
    );
    
};

export default SpecificMonthIncomeComponent;

