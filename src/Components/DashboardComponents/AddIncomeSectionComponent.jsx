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
  darkMode
}) => {

  const [showYears, setShowYears] = useState(false);
  const [uniqueYears, setUniqueYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showRecurringOnly, setShowRecurringOnly] = useState(false);
  const [filteredIncome, setFilteredIncome] = useState(userData);
  const [sortOrder, setSortOrder] = useState('desc');

  //Display all months so the user can filter by month
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

  //Update income
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

    if(selectedCategory !== null && selectedCategory !== '') {
      updatedIncome = updatedIncome.filter(
        (income) => income.category === selectedCategory
      );
    }

    if(showRecurringOnly) {
      updatedIncome = updatedIncome.filter(
        (income) => income.is_recurring);
    }

  
    setFilteredIncome(updatedIncome);
  }, [userData, selectedYear, selectedMonth, showRecurringOnly, selectedCategory]);

  //Toggle is recurring income
  const toggleRecurringIncome = () => {
    setShowRecurringOnly((previous) => !previous);
  }
  

  //User to filter by year
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


  //User to filter by month
  const handleMonthClick = (monthIndex) => {
    if (selectedMonth === monthIndex) {
      setSelectedMonth(null);
      setFilteredIncome(() =>
        selectedYear
          ? userData.filter((income) =>
              income.date_received.startsWith(selectedYear.toString())
            )
          : userData
      );
    } else {
      setSelectedMonth(monthIndex);
      setFilteredIncome(() =>
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

  //Display all years user used app
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


const handleCategoryClick = (category) => {
  setSelectedCategory((prevCategory) => (prevCategory === category ? null : category));
};

  const incomeCategoryTypes = userData.filter((income) => income.category);
  const allIncomeCategories = Array.from(new Set(userData.map((income) => income.category)));  
  console.log('incomeCategoryTypes:', incomeCategoryTypes);
  console.log('allIncomeCategories:', allIncomeCategories);

  const toggleSortOrder = () => {
    setSortOrder((previousOrder) => (previousOrder === 'asc' ? 'desc' : 'asc'));
  };
  
  const sortedIncome = filteredIncome.slice().sort((a, b) => {
    if (sortOrder === 'asc') {
      return new Date(a.date_received) - new Date(b.date_received);
    } else {
      return new Date(b.date_received) - new Date(a.date_received);
    }
  });

  return (
    <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'} shadow-lg rounded-lg p-6 mt-6 border border-gray-200 relative overflow-hidden`}>
      <div className="relative mb-4">
        <h2 className={`text-xl font-semibold leading-none text-center ${darkMode ? 'text-white' : 'text-gray-700'}`}>
          Added Incomes
        </h2>
        <div
          className="absolute top-0 right-0 text-black text-2xl cursor-pointer"
          onClick={allUserYears}>
          &#x22EE;
        </div>
      </div>


      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showRecurringOnly}
            onChange={toggleRecurringIncome}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700">Show Recurring Income Only</span>
        </label>
      </div>
  
      {showYears && (
        <div
          className={`absolute top-0 right-0 w-1/3 h-full bg-white shadow-xl rounded-l-lg border-l border-gray-300 z-30 transform ${
            showYears ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out`}>
          <div className="overflow-y-auto h-full p-6">

            <h3 className="text-gray-800 font-bold text-lg mb-4">Years</h3>
            <div className="relative">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white"
                value={selectedYear !== null ? selectedYear : ""}
                onChange={(e) => handleYearClick(Number(e.target.value))}>
                <option value="" disabled>
                  Select a year
                </option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
  
            <h3 className="text-gray-800 font-bold text-lg mt-6 mb-4">Months</h3>
            <div className="relative">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white"
                value={selectedMonth !== null ? selectedMonth : ""}
                onChange={(event) => handleMonthClick(Number(event.target.value))} >
                <option value="" disabled>
                  Select a month
                </option>
                <option value="">All Months</option>
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <h3 className="text-gray-800 font-bold text-lg mt-6 mb-4">Categories</h3>
            <div className="relative">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white"
                value={selectedCategory || ""}
                onChange={(event) => handleCategoryClick(event.target.value)}>
                  <option value="" disabled>
                    Select an expense category
                  </option>
                <option value="">All Categories</option>
                {allIncomeCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
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
            <th onClick={toggleSortOrder} className="border border-gray-300 px-4 py-2 text-center text-gray-600 cursor-pointer">
              Date Received
              {sortOrder === 'asc' ? ' ▲' : ' ▼'}
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {userData.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center text-gray-500">
                No income to display. Add Your Income!
              </td>
            </tr>
          ) : sortedIncome.length > 0 ? (
            sortedIncome
              .slice(0, showAllIncome ? sortedIncome.length : 4)
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
  darkMode: PropTypes.func.isRequired,
};

export default AddIncomeSectionComponent;
