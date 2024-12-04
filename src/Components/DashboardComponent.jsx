import { useState } from "react";

const DashboardComponent = () => {
  const [userData, setUserData] = useState({
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
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full">
            Add Income
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full">
            Add Expense
          </button>
        </section>
      </main>
    </div>
  );
};

export default DashboardComponent;
