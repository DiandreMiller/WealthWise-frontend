// import { useState } from "react";
// import { useParams } from "react-router-dom";

// const DashboardComponent = () => {

//   const userId = useParams();

//   const [userData, setUserData] = useState({
//     name: "Diandre",
//     stats: {
//       balance: 100000.0,
//       income: 5000,
//       expenses: 2000,
//     },
//     recentActivities: [
//       { type: "Expense", description: "Libby's Gift", amount: 1200, date: "2024-12-01" },
//       { type: "Income", description: "Work", amount: 1000, date: "2024-12-01" },
//       { type: "Expense", description: "Groceries", amount: 50, date: "2024-11-30" },
//     ],
//   });

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       <header className="bg-gray-800 p-4">
//         <h1 className="text-2xl font-bold">Welcome, {userData.name}!</h1>
//       </header>

//       <main className="p-6">
//         <section className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
//           <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
//             <h2 className="text-lg font-semibold">Current Balance</h2>
//             <p className="text-2xl font-bold text-green-400">${userData.stats.balance.toFixed(2)}</p>
//           </div>
//           <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
//             <h2 className="text-lg font-semibold">Monthly Income</h2>
//             <p className="text-2xl font-bold text-blue-400">${userData.stats.income.toFixed(2)}</p>
//           </div>
//           <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
//             <h2 className="text-lg font-semibold">Monthly Expenses</h2>
//             <p className="text-2xl font-bold text-red-400">${userData.stats.expenses.toFixed(2)}</p>
//           </div>
//         </section>

//         <section className="mb-8">
//           <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
//           <div className="bg-gray-800 p-4 rounded-lg shadow-md">
//             <ul>
//               {userData.recentActivities.map((activity, index) => (
//                 <li
//                   key={index}
//                   className="flex justify-between items-center border-b border-gray-700 py-2"
//                 >
//                   <div>
//                     <span className="font-bold">{activity.type}:</span> {activity.description}
//                   </div>
//                   <div
//                     className={
//                       activity.type === "Income" ? "text-green-400" : "text-red-400"
//                     }
//                   >
//                     ${activity.amount.toFixed(2)}
//                   </div>
//                   <div className="text-sm text-gray-400">{activity.date}</div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </section>

//         <section className="flex space-x-4 justify-center">
//           <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full">
//             Add Income
//           </button>
//           <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full">
//             Add Expense
//           </button>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default DashboardComponent;

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const DashboardComponent = () => {
  const { userId } = useParams(); 
  const [userData, setUserData] = useState(null);
  const [isAddingIncome, setIsAddingIncome] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [incomeDescription, setIncomeDescription] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");

  useEffect(() => {
    setUserData({
      name: "Diandre", 
      stats: {
        balance: 100000.0,
        income: 5000,
        expenses: 2000,
      },
      recentActivities: [
        { type: "Expense", description: "Libby's Gift", amount: 1200, date: "2024-12-01" },
        { type: "Income", description: "Work", amount: 1000, date: "2024-12-01" },
        { type: "Expense", description: "Groceries", amount: 50, date: "2024-11-30" },
      ],
    });
  }, [userId]);

  // Function to add income
  const addIncome = () => {
    const amount = parseFloat(incomeAmount);
    if (isNaN(amount) || amount <= 0 || incomeDescription.trim() === "") {
      alert("Please provide valid income description and amount.");
      return;
    }

    setUserData(prevData => {
      const newIncome = prevData.stats.income + amount;
      const newBalance = prevData.stats.balance + amount;
      const newActivity = { type: "Income", description: incomeDescription, amount, date: new Date().toLocaleDateString() };

      return {
        ...prevData,
        stats: {
          ...prevData.stats,
          income: newIncome,
          balance: newBalance,
        },
        recentActivities: [newActivity, ...prevData.recentActivities],
      };
    });

    // Clear inputs and close the form
    setIncomeDescription("");
    setIncomeAmount("");
    setIsAddingIncome(false);
  };

  // Function to add expense
  const addExpense = () => {
    const amount = parseFloat(expenseAmount);
    if (isNaN(amount) || amount <= 0 || expenseDescription.trim() === "") {
      alert("Please provide valid expense description and amount.");
      return;
    }

    setUserData(prevData => {
      const newExpense = prevData.stats.expenses + amount;
      const newBalance = prevData.stats.balance - amount;
      const newActivity = { type: "Expense", description: expenseDescription, amount, date: new Date().toLocaleDateString() };

      return {
        ...prevData,
        stats: {
          ...prevData.stats,
          expenses: newExpense,
          balance: newBalance,
        },
        recentActivities: [newActivity, ...prevData.recentActivities],
      };
    });

    // Clear inputs and close the form
    setExpenseDescription("");
    setExpenseAmount("");
    setIsAddingExpense(false);
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4">
        <h1 className="text-2xl font-bold">Welcome, {userData.name}!</h1>
      </header>

      <main className="p-6">
        <section className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h2 className="text-lg font-semibold">Current Balance</h2>
            <p className="text-2xl font-bold text-green-400">${userData.stats.balance.toFixed(2)}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h2 className="text-lg font-semibold">Monthly Income</h2>
            <p className="text-2xl font-bold text-blue-400">${userData.stats.income.toFixed(2)}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h2 className="text-lg font-semibold">Monthly Expenses</h2>
            <p className="text-2xl font-bold text-red-400">${userData.stats.expenses.toFixed(2)}</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <ul>
              {userData.recentActivities.map((activity, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border-b border-gray-700 py-2"
                >
                  <div>
                    <span className="font-bold">{activity.type}:</span> {activity.description}
                  </div>
                  <div
                    className={
                      activity.type === "Income" ? "text-green-400" : "text-red-400"
                    }
                  >
                    ${activity.amount.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">{activity.date}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="flex space-x-4 justify-center">
          <button
            onClick={() => setIsAddingIncome(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full"
          >
            Add Income
          </button>
          <button
            onClick={() => setIsAddingExpense(true)}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full"
          >
            Add Expense
          </button>
        </section>

        {isAddingIncome && (
          <div className="mt-8 p-4 bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Add Income</h3>
            <input
              type="text"
              placeholder="Description"
              value={incomeDescription}
              onChange={(e) => setIncomeDescription(e.target.value)}
              className="mb-4 p-2 w-full bg-gray-700 text-white rounded-lg"
            />
            <input
              type="number"
              placeholder="Amount"
              value={incomeAmount}
              onChange={(e) => setIncomeAmount(e.target.value)}
              className="mb-4 p-2 w-full bg-gray-700 text-white rounded-lg"
            />
            <button
              onClick={addIncome}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-8 rounded-full"
            >
              Add Income
            </button>
            <button
              onClick={() => setIsAddingIncome(false)}
              className="ml-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-8 rounded-full"
            >
              Cancel
            </button>
          </div>
        )}

        {isAddingExpense && (
          <div className="mt-8 p-4 bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Add Expense</h3>
            <input
              type="text"
              placeholder="Description"
              value={expenseDescription}
              onChange={(e) => setExpenseDescription(e.target.value)}
              className="mb-4 p-2 w-full bg-gray-700 text-white rounded-lg"
            />
            <input
              type="number"
              placeholder="Amount"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              className="mb-4 p-2 w-full bg-gray-700 text-white rounded-lg"
            />
            <button
              onClick={addExpense}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-8 rounded-full"
            >
              Add Expense
            </button>
            <button
              onClick={() => setIsAddingExpense(false)}
              className="ml-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-8 rounded-full"
            >
              Cancel
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardComponent;
