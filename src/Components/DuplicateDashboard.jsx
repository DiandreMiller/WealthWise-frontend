import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DashboardComponent = () => {
  const { userId } = useParams(); 
  const [userData, setUserData] = useState(null);
  const [isAddingIncome, setIsAddingIncome] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [incomeDescription, setIncomeDescription] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");

  const backEndUrl = import.meta.env.VITE_REACT_APP_BACKEND_API

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
    const addIncome = async () => {
        const amount = parseFloat(incomeAmount);
    
        if (isNaN(amount) || amount <= 0 || incomeDescription.trim() === "") {
        alert("Please provide valid income description and amount.");
        return;
        }
  
        const dateReceived = new Date().toLocaleDateString('en-CA'); 
  
        try {
            await axios.post(`${backEndUrl}/users/${userId}/income'`, {
            user_id: userId,            
            amount: amount,
            source: incomeDescription,
            date_received: dateReceived, 
            created_at: new Date(),     
      });
  
      // Update user data directly
      setUserData(prevData => {
        const newIncomeAmount = prevData.stats.income + amount;
        const newBalance = prevData.stats.balance + amount;
        const newActivity = { type: "Income", description: incomeDescription, amount, date: dateReceived };
  
        return {
          ...prevData,
          stats: {
            ...prevData.stats,
            income: newIncomeAmount,
            balance: newBalance,
          },
          recentActivities: [newActivity, ...prevData.recentActivities],
        };
      });
  
      // Clear inputs and close the form
      setIncomeDescription("");
      setIncomeAmount("");
      setIsAddingIncome(false);
    } catch (error) {
      console.error("Error adding income:", error);
      alert("There was an error adding your income. Please try again.");
    }
  };

  // Function to update income
    const updateIncome = async (incomeId, updatedAmount, updatedSource) => {
        if (!incomeId || isNaN(parseFloat(updatedAmount)) || updatedAmount <= 0 || updatedSource.trim() === "") {
            alert("Please provide valid income details.");
            return;
    }
  
    try {
      // Send PUT request to backend to update the income record
      const response = await axios.put(`/users/${userId}/income/${incomeId}`, {
        amount: updatedAmount,
        source: updatedSource,
      });
  
      const updatedIncome = response.data;
  
      // Update the state to reflect the updated income
      setUserData(prevData => {
        const updatedActivities = prevData.recentActivities.map(activity =>
          activity.type === "Income" && activity.id === incomeId
            ? { ...activity, amount: updatedIncome.amount, description: updatedIncome.source }
            : activity
        );
  
        const newIncome = prevData.stats.income - 
                          prevData.recentActivities.find(a => a.id === incomeId)?.amount + 
                          updatedIncome.amount;
  
        return {
          ...prevData,
          stats: {
            ...prevData.stats,
            income: newIncome,
          },
          recentActivities: updatedActivities,
        };
      });
  
      alert("Income updated successfully!");
    } catch (error) {
      console.error("Error updating income:", error);
      alert("There was an error updating your income. Please try again.");
    }
  };

    // Function to delete income
    const deleteIncome = async (incomeId) => {
        if (!incomeId) {
            alert("Invalid income ID.");
            return;
    }
  
    try {
      // Send DELETE request to backend to remove the income record
      await axios.delete(`${backEndUrl}/users/${userId}/income/${incomeId}`);
  
      // Update the state to remove the deleted income from activities and stats
      setUserData(prevData => {
        const deletedIncome = prevData.recentActivities.find(
          activity => activity.type === "Income" && activity.id === incomeId
        );
  
        if (!deletedIncome) return prevData;
  
        const newIncome = prevData.stats.income - deletedIncome.amount;
        const newBalance = prevData.stats.balance - deletedIncome.amount;
  
        const updatedActivities = prevData.recentActivities.filter(
          activity => !(activity.type === "Income" && activity.id === incomeId)
        );
  
        return {
          ...prevData,
          stats: {
            ...prevData.stats,
            income: newIncome,
            balance: newBalance,
          },
          recentActivities: updatedActivities,
        };
      });
  
      alert("Income record deleted successfully!");
    } catch (error) {
      console.error("Error deleting income:", error);
      alert("There was an error deleting your income record. Please try again.");
    }
  };

  // Function to add expense
    const addExpense = async () => {
        const amount = parseFloat(expenseAmount);
  
        if (isNaN(amount) || amount <= 0 || expenseDescription.trim() === "") {
            alert("Please provide valid expense description and amount.");
            return;
        }
  
        const dateIncurred = new Date().toLocaleDateString('en-CA'); // Format date as 'YYYY-MM-DD'
  
        try {
            // Send POST request to backend to create a new expense record
            await axios.post(`${backEndUrl}/users/${userId}/expenses`, {
            user_id: userId,            
            amount: amount,
            category: expenseDescription,
            date_incurred: dateIncurred, 
        });
  
      // Update user data directly
      setUserData(prevData => {
        const newExpenseAmount = prevData.stats.expenses + amount;
        const newBalance = prevData.stats.balance - amount;
        const newActivity = { type: "Expense", description: expenseDescription, amount, date: dateIncurred };
  
        return {
          ...prevData,
          stats: {
            ...prevData.stats,
            expenses: newExpenseAmount,
            balance: newBalance,
          },
          recentActivities: [newActivity, ...prevData.recentActivities],
        };
      });
  
      // Clear inputs and close the form
      setExpenseDescription("");
      setExpenseAmount("");
      setIsAddingExpense(false);
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("There was an error adding your expense. Please try again.");
    }
  };

// Function to create a budget
const createBudget = async (budgetData) => {
  const {
    monthlyIncomeGoal,
    monthlyExpenseGoal,
    actualIncome,
    actualExpenses,
  } = budgetData;

  if (
    isNaN(monthlyIncomeGoal) ||
    isNaN(monthlyExpenseGoal) ||
    isNaN(actualIncome) ||
    isNaN(actualExpenses)
  ) {
    alert("Please provide valid numbers for all fields.");
    return;
  }

  try {
    // Send POST request to backend to create the budget
    const response = await axios.post(`${backEndUrl}/users/${userId}/budget`, {
      monthly_income_goal: parseFloat(monthlyIncomeGoal),
      monthly_expense_goal: parseFloat(monthlyExpenseGoal),
      actual_income: parseFloat(actualIncome),
      actual_expenses: parseFloat(actualExpenses),
    });

    const newBudget = response.data;

    // Update the state with the new budget
    setUserData(prevData => ({
      ...prevData,
      budget: newBudget,
    }));

    alert("Budget created successfully!");
  } catch (error) {
    console.error("Error creating budget:", error);
    alert("There was an error creating your budget. Please try again.");
  }
};


// Function to update a budget
const updateBudget = async (budgetId, updatedBudgetData) => {
  const {
    monthlyIncomeGoal,
    monthlyExpenseGoal,
    actualIncome,
    actualExpenses,
  } = updatedBudgetData;

  if (
    isNaN(monthlyIncomeGoal) ||
    isNaN(monthlyExpenseGoal) ||
    isNaN(actualIncome) ||
    isNaN(actualExpenses)
  ) {
    alert("Please provide valid numbers for all fields.");
    return;
  }

  try {
    const response = await axios.put(`${backEndUrl}/users/${userId}/budget/${budgetId}`, {
      monthly_income_goal: parseFloat(monthlyIncomeGoal),
      monthly_expense_goal: parseFloat(monthlyExpenseGoal),
      actual_income: parseFloat(actualIncome),
      actual_expenses: parseFloat(actualExpenses),
    });

    const updatedBudget = response.data;

    // Update the state with the updated budget
    setUserData(prevData => ({
      ...prevData,
      budget: updatedBudget,
    }));

    alert("Budget updated successfully!");
  } catch (error) {
    console.error("Error updating budget:", error);
    alert("There was an error updating your budget. Please try again.");
  }
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
