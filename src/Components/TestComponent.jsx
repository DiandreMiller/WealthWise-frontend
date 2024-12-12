import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import ExpenseEditModal from './ExpenseEditModal';

const TestComponent = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseUser, setExpenseUser] = useState({ expenses: [] });
  const [loading, setLoading] = useState(true);
  const [showAllExpense, setShowAllExpense] = useState(false);
  const [isEditingExpense, setIsEditingExpense] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [updateEditedExpense, setUpdateEditedExpense] = useState(false);

  const backEndUrl = import.meta.env.VITE_REACT_APP_BACKEND_API;

  // Fetch expenses and update the state
  useEffect(() => {
    const fetchExpensesData = async () => {
        setLoading(true);
        try {
            console.log("Fetching expenses...");
            const response = await axios.get(`${backEndUrl}/users/${userId}/expenses`);
            console.log("Fetched data:", response.data);
            const expenses = response.data || [];
            console.log('Fetched expenses:', expenses);

            setExpenseUser((prevData) => ({
                ...prevData,
                expenses: expenses, 
            }));
        } catch (error) {
            console.error("Error fetching user expenses:", error);
        } finally {
            setLoading(false);
        }
    };

    if (userId && backEndUrl) {
      console.log("Re-fetching expenses...");
      fetchExpensesData();
    }
  }, [userId, backEndUrl, updateEditedExpense]);

  const formatCurrency = (value) => {
    const numberValue = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(numberValue)) {
      return `$0.00`; 
    }
    return `$${numberValue.toFixed(2)}`;
  };

  const totalIncome = (incomes) => {
    const sumOfIncomes = incomes.reduce((a, b) => a + parseFloat(b.amount), 0);
    return formatCurrency(sumOfIncomes); 
  };

  const addExpense = async () => {
    console.log('user data Expense check:', expenseUser);
    const amount = parseFloat(expenseAmount);

    if (isNaN(amount) || amount <= 0 || expenseDescription.trim() === "") {
      alert("Please provide a valid expense description and amount.");
      return;
    }

    const dateIncurred = new Date().toLocaleDateString("en-CA");

    console.log("Attempting to add expense with details:", {
      userId,
      amount,
      category: expenseDescription,
      dateIncurred,
    });

    try {
        // Send POST request to backend to create a new expense record
        const response = await axios.post(`${backEndUrl}/users/${userId}/expenses`, {
            user_id: userId,
            amount: amount.toFixed(2), 
            category: expenseDescription,
            date_incurred: dateIncurred,
            created_at: new Date().toISOString(), 
        });

        console.log("Response add expense:", response.data);

        // Update user data directly in the frontend state
        setExpenseUser((prevData) => {
            const newExpense = {
                id: response.data.id, 
                user_id: userId,
                amount: amount.toFixed(2),
                category: expenseDescription,
                date_incurred: dateIncurred,
                created_at: new Date().toISOString(),
                User: prevData?.User || null,
            };
            return {
                ...prevData,
                expenses: [...(prevData.expenses || []), newExpense], 
                stats: {
                    ...prevData.stats,
                    expenses: (parseFloat(prevData.amount) + parseFloat(amount)).toFixed(2),
                    balance: (parseFloat(prevData.amount) - parseFloat(amount)).toFixed(2),
                },
                recentActivities: [
                    { type: "Expense", description: expenseDescription, amount: amount.toFixed(2), date: dateIncurred },
                    ...(prevData.recentActivities || []),
                ],
            };
        });

        // Reset form fields
        setExpenseDescription("");
        setExpenseAmount("");
        setIsAddingExpense(false);
    } catch (error) {
        console.error("Error adding expense:", error);
        alert("There was an error adding your expense. Please try again.");
    }
  };

  const updateExpense = async (expenseId, updatedAmount, updatedCategory) => {
    console.log(`[${new Date().toISOString()}] Triggered updateExpense with expenseId: ${expenseId}`);

    if (!expenseId || isNaN(parseFloat(updatedAmount)) || updatedAmount <= 0 || updatedCategory.trim() === "") {
      alert("Please provide valid expense details.");
      return;
    }

    try {
        const response = await axios.put(`${backEndUrl}/users/${userId}/expenses/${expenseId}`, {
          amount: updatedAmount,
          category: updatedCategory,
        });

        const updatedExpense = response.data;
        console.log(`[${new Date().toISOString()}] Expense successfully updated on server:`, updatedExpense);

        setExpenseUser((prevData) => {
          const updatedExpenses = prevData.expenses.map((expense) =>
            expense.id === expenseId
              ? { ...expense, amount: updatedExpense.amount, category: updatedExpense.category }
              : expense
          );

          return {
            ...prevData,
            expenses: updatedExpenses,
          };
        });

        setUpdateEditedExpense((prev) => !prev);
        setIsEditingExpense(false);

        alert("Expense updated successfully!");
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error updating expense:`, error);
        alert("There was an error updating your expense. Please try again.");
    }
  };

  if (!expenseUser.expenses.length) {
    return <div>Add Some Expenses.</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg mt-24">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Financial Dashboard</h1>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Expenses</h2>
          {isAddingExpense ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Expense Description"
                value={expenseDescription}
                onChange={(e) => setExpenseDescription(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="number"
                placeholder="Amount"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="flex space-x-4">
                <button
                  className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  onClick={addExpense}
                >
                  Add
                </button>
                <button
                  className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition-colors"
                  onClick={() => setIsAddingExpense(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => setIsAddingExpense(true)}
            >
              Add Expense
            </button>
          )}
        </div>
      </main>

      <div>
        {isEditingExpense && (
          <ExpenseEditModal 
            expense={expenseToEdit}
            onClose={() => setIsEditingExpense(false)} 
            onSave={updateExpense}
            onSubmit={(id, amount, category) => updateExpense(id, amount, category)}
          />
        )}
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mt-6 border border-gray-200">
         <h2 className="text-xl font-semibold text-gray-700 mb-4">Added Expenses</h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Source</th>
                <th className="border border-gray-300 px-4 py-2 text-right text-gray-600">Expense</th>
                <th className="border border-gray-300 px-4 py-2 text-center text-gray-600">Date Received</th>
                <th className="border border-gray-300 px-4 py-2 text-center text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenseUser.expenses?.reverse().map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-gray-800">{expense.category}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right text-gray-800">{formatCurrency(expense.amount)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-800">{expense.date_incurred}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      className="text-sm bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-colors mr-2"
                      onClick={() => {
                        setExpenseToEdit(expense);
                        setIsEditingExpense(true); 
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 text-right font-semibold text-xl text-gray-700">
           Total Expenses: {totalIncome(expenseUser.expenses)}
         </div>
      </div>
    </div>
  );
};

export default TestComponent;
