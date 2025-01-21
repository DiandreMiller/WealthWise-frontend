import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

const AddIncomeSectionComponent = ({
  userData,
  formatCurrency,
  totalIncome,
  setIncomeToEdit,
  setIsEditingIncome,
  deleteIncome,
  showAllIncome,
  setShowAllIncome,
}) => {

  const [showYears, setShowYears] = useState(false);
  const [uniqueYears, setUniqueYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [filteredIncome, setFilteredIncome] = useState(userData);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  console.log('userData:', userData);

  useEffect(() => {
    let updatedIncome = userData;
  
    if (selectedYear !== null) {
      updatedIncome = updatedIncome.filter(
        (income) => Number(income.date_received.slice(0, 4)) === selectedYear
      );
    }
  
    if (selectedMonth !== null) {
      updatedIncome = updatedIncome.filter(
        (income) => Number(income.date_received.slice(5, 7)) - 1 === selectedMonth
      );
    }
  
    setFilteredIncome(updatedIncome);
  }, [userData, selectedYear, selectedMonth]);
  

  const handleYearClick = (year) => {
    if (selectedYear === year) {
      setSelectedYear(null); 
      setFilteredIncome(userData); 
    } else {
      setSelectedYear(year);
      setFilteredIncome(
        userData.filter(
          (income) => Number(income.date_received.slice(0, 4)) === year
        )
      );
    }
  };


  const handleMonthClick = (monthIndex) => {
    if (selectedMonth === monthIndex) {
      setSelectedMonth(null);
      setFilteredIncome((previous) =>
        selectedYear
          ? userData.filter((income) =>
              income.date_received.startsWith(selectedYear.toString())
            )
          : userData
      );
    } else {
      setSelectedMonth(monthIndex);
      setFilteredIncome((previous) =>
        userData.filter((income) => {
          const incomeYear = Number(income.date_received.slice(0, 4));
          const incomeMonth = Number(income.date_received.slice(5, 7)) - 1;
          return (
            (selectedYear ? incomeYear === selectedYear : true) &&
            incomeMonth === monthIndex
          );
        })
      );
    }
  };

  const allUserYears = () => {
    console.log('userData in allUserYears:', userData)
    const incomeYears = userData.map((income) => {
      const year = Number(income.date_received.slice(0,4));
      return year 
    })

    const uniqueYearsList = Array.from(new Set(incomeYears));

    setUniqueYears(uniqueYearsList);
    console.log('uniqueYearsList:', uniqueYearsList);
    setShowYears(previous => !previous);
  }


  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6 border border-gray-200 relative overflow-hidden">
      <div className="relative mb-4">
        <h2 className="text-xl font-semibold text-gray-700 leading-none text-center">
          Added Incomes
        </h2>
        <div
          className="absolute top-0 right-0 text-black text-2xl cursor-pointer"
          onClick={allUserYears}
        >
          &#x22EE;
        </div>
      </div>
  
      {showYears && (
        <div
          className={`absolute top-0 right-0 w-1/3 h-full bg-white shadow-xl rounded-l-lg border-l border-gray-300 z-30 transform ${
            showYears ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out`}
        >
          <div className="overflow-y-auto h-full p-6">
            <h3 className="text-gray-800 font-bold text-lg mb-4">Years</h3>
            <ul className="space-y-3">
              {uniqueYears.map((year) => (
                <li
                  className={`text-base font-medium px-4 py-2 rounded-md cursor-pointer ${
                    selectedYear === year
                      ? "bg-green-200 text-green-700"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  } transition-colors`}
                  key={year}
                  onClick={() => handleYearClick(year)}
                >
                  {year}
                </li>
              ))}
            </ul>
  
            <h3 className="text-gray-800 font-bold text-lg mt-6 mb-4">Months</h3>
            <ul className="space-y-3">
              {months.map((month, index) => (
                <li
                  key={month}
                  className={`text-base font-medium px-4 py-2 rounded-md cursor-pointer ${
                    selectedMonth === index
                      ? "bg-blue-200 text-blue-700"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => handleMonthClick(index)}
                >
                  {month}
                </li>
              ))}
            </ul>
            <button
              className="mt-6 w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              onClick={allUserYears}
            >
              Close
            </button>
          </div>
        </div>
      )}
  
      <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
              Source
            </th>
            <th className="border border-gray-300 px-4 py-2 text-right text-gray-600">
              Income
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center text-gray-600">
              Date Received
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredIncome.length > 0 ? (
            filteredIncome
              .slice()
              .reverse()
              .slice(0, showAllIncome ? filteredIncome.length : 4)
              .map((income) => (
                <tr key={income.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-gray-800">
                    {income.source}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right text-gray-800">
                    {formatCurrency(income.amount)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-800">
                    {income.date_received}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      className="text-sm bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-colors mr-2"
                      onClick={() => {
                        setIncomeToEdit(income);
                        setIsEditingIncome(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                      onClick={() => deleteIncome(income.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-gray-500">
                There is no income to display for the time period selected.
              </td>
            </tr>
          )}
        </tbody>
      </table>
  
      <div className="mt-4 text-right font-semibold text-xl text-gray-700">
        Total Income: {totalIncome(filteredIncome)}
      </div>
  
      <button
        className="mt-4 text-blue-500 hover:underline"
        onClick={() => setShowAllIncome((prevState) => !prevState)}
      >
        {showAllIncome ? "See Less" : "See More"}
      </button>
    </div>
  );
  
  
  
  
  
};

AddIncomeSectionComponent.propTypes = {
  userData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      source: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date_received: PropTypes.string.isRequired,
    })
  ).isRequired,
  formatCurrency: PropTypes.func.isRequired,
  totalIncome: PropTypes.func.isRequired,
  setIncomeToEdit: PropTypes.func.isRequired,
  setIsEditingIncome: PropTypes.func.isRequired,
  deleteIncome: PropTypes.func.isRequired,
  showAllIncome: PropTypes.bool.isRequired,
  setShowAllIncome: PropTypes.func.isRequired,
};

export default AddIncomeSectionComponent;
