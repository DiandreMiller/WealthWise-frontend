import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import IncomeEditModal from './IncomeEditModal';
import ExpenseEditModal from './ExpenseEditModal';
import IncomeSectionComponent from "./IncomeSectionComponent";
import ExpenseSectionComponent from "./ExpenseSectionComponent";
import BudgetSectionComponent from "./BudgetSectionComponent";
import AddIncomeSectionComponent from "./AddIncomeSectionComponent";
import AddExpenseSectionComponent from "./AddExpenseSectionComponent";
import AddBudgetSectionComponent from "./AddBudgetComponent";
import BudgetEditModal from './BudgetEditModal';

const DashboardComponent = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState([]);
  const [isAddingIncome, setIsAddingIncome] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [incomeDescription, setIncomeDescription] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseUser, setExpenseUser] = useState({ expenses: [] });
  const [newAmount, setNewAmount] = useState('');
  const [newSource, setNewSource] = useState('');
  const [newMonthlyIncomeGoal, setNewMonthlyIncomeGoal] = useState('');
  const [newMonthlyExpenseGoal, setNewMonthlyExpenseGoal] = useState('');
  const [newActualIncome, setNewActualIncome] = useState('');
  const [newActualExpenses, setNewActualExpenses] = useState('');
  const [updatedIncome, setUpdatedIncome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllIncome, setShowAllIncome] = useState(false);
  const [showAllExpense, setShowAllExpense] = useState(false);
  const [isEditingIncome, setIsEditingIncome] = useState(false); 
  const [incomeToEdit, setIncomeToEdit] = useState(null); 
  const [deletedIncome, setDeleteIncome] = useState(false);
  const [updateEditedIncome, setUpdateEditedIncome] = useState(false);
  const [isEditingExpense, setIsEditingExpense] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [updateEditedExpense, setUpdateEditedExpense] = useState(false);
  const [budgetUserData, setBudgetUserData] = useState({});
  const [isAddingBudget, setIsAddingBudget] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState(null);


  const backEndUrl = import.meta.env.VITE_REACT_APP_BACKEND_API;

//Get income
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${backEndUrl}/users/${userId}/income`);
        const formattedData = response.data.map((income) => ({
          ...income,
          amount: parseFloat(income.amount), 
        }));
        setUserData(formattedData);
        console.log("User data fetched:", formattedData);
        setUpdatedIncome(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    if (userId && backEndUrl) {
      fetchUserData();
    }
  }, [userId, backEndUrl, deletedIncome, updateEditedIncome]);
  
  

  //Get Expense
  useEffect(() => {
    const fetchExpensesData = async () => {
        setLoading(true);
        try {
            console.log("Fetching expenses...");
            const response = await axios.get(`${backEndUrl}/users/${userId}/expenses`);
            console.log("Fetched data:", response.data);
            const expenses = response.data.map((expense) => ({
              ...expense,
              amount: parseFloat(expense.amount),
            }));
            console.log('Fetched expenses:', expenses);

            setExpenseUser((prevData) => ({
                ...prevData,
                expenses: expenses, 
            }));
        } catch (error) {
            console.error("Error fetching user expenses:", error);
            setExpenseUser({ expenses: []});
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
  }

  // Function for total income
  const totalIncome = (incomes) => {
    const sumOfIncomes = incomes.reduce((a, b) => a + parseFloat(b.amount), 0);
    return formatCurrency(sumOfIncomes); 
  };

  // Function to update income
  const updateIncome = async (incomeId, updatedAmount, updatedSource) => {
    if (!incomeId || isNaN(parseFloat(updatedAmount)) || updatedAmount <= 0 || updatedSource.trim() === "") {
      alert("Please provide valid income details.");
      return;
    }

    console.log(`User ID: ${userId}`);
    console.log(`Income ID: ${incomeId}`);
    console.log('Sending data to update income:', {
      amount: updatedAmount,
      source: updatedSource,
    });
  
    try {
      // Send PUT request to update income
      const response = await axios.put(`${backEndUrl}/users/${userId}/income/${incomeId}`, {
        amount: updatedAmount,
        source: updatedSource,
      });
  
      const updatedIncome = response.data;
      console.log("Updated income:", updatedIncome);
  
      setUserData(prevData => {

        if(!prevData || !Array.isArray(prevData.income)) {
          console.error("Invalid income data:", prevData);
          return prevData;
        }

        const updatedIncomes = prevData.income.map(income =>
          income.id === incomeId
            ? { ...income, amount: updatedIncome.amount, source: updatedIncome.source }
            : income
        );
  
        return {
          ...prevData,
          income: updatedIncomes,
        };
      });

      setUpdateEditedIncome(previous => !previous);
      console.log('UpdateEditedIncome:', updateEditedIncome);
  
      alert("Income updated successfully!");
      setIsEditingIncome(false);
    } catch (error) {
      console.error("Error updating income:", error);
      alert("There was an error updating your income. Please try again.");
    }
  };
  

  //Function to add income
  const addIncome = async () => {
    const amount = parseFloat(incomeAmount);

    if (isNaN(amount) || amount <= 0 || incomeDescription.trim() === "") {
        alert("Please provide valid income description and amount.");
        return;
    }

    const dateReceived = new Date().toLocaleDateString("en-CA"); // Format: YYYY-MM-DD

    console.log("Attempting to add income with details:", {
        userId,
        amount,
        description: incomeDescription,
        dateReceived,
    });

    try {
        const response = await axios.post(`${backEndUrl}/users/${userId}/income`, {
            user_id: userId,
            amount: amount.toFixed(2), 
            source: incomeDescription,
            date_received: dateReceived,
            created_at: new Date().toISOString(), 
        });

        console.log("Response add income:", response);

        // Update user data 
        setUserData((prevData) => {
            console.log("prevData:", prevData);
            const newIncome = {
                id: response.data.id, 
                user_id: userId,
                amount: amount.toFixed(2),
                source: incomeDescription,
                date_received: dateReceived,
                created_at: new Date().toISOString(),
                User: prevData?.User || null, 
            };

            return [...prevData, newIncome]; 
        });

        // Reset form fields
        setIncomeDescription("");
        setIncomeAmount("");
        setIsAddingIncome(false);
    } catch (error) {
        console.error("Error adding income:", error);
        alert("There was an error adding your income. Please try again.");
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

        // Update the state to remove the deleted income
        setUserData(prevData => {

          const income = Array.isArray(prevData.income) ? prevData.income : [];

          const deletedIncome = income.find(
            activity => activity.id === incomeId
          );

          if (!deletedIncome) {
            return prevData;
          }

          const newIncome = income.filter(activity => activity.id !== incomeId);
          const newBalance = newIncome.reduce((total, item) => total + parseFloat(item.amount),0);

          return {
            ...prevData,
              income: newIncome,
              balance: newBalance,
          
          };
        });

        setDeleteIncome(previous => !previous);

        alert("Income record deleted successfully!");
      } catch (error) {
        console.error("Error deleting income:", error);
        alert("There was an error deleting your income record. Please try again.");
      }
};


 // Function to add expense
const addExpense = async () => {
  console.log('user data Expense check:', expenseUser);
  const amount = parseFloat(expenseAmount);

  if (isNaN(amount) || amount <= 0 || expenseDescription.trim() === "") {
    alert("Please provide a valid expense description and amount.");
    return;
  }

  const dateIncurred = new Date().toLocaleDateString("en-CA"); // Format: YYYY-MM-DD

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

    // Update user data directly
    setExpenseUser((prevData) => {
      console.log("prevData before adding expense:", prevData);

      // Add the new expense object
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
          expenses: (parseFloat(prevData.stats?.expenses || 0) + parseFloat(amount)).toFixed(2),
          balance: (parseFloat(prevData.stats?.balance || 0) - parseFloat(amount)).toFixed(2),
        },
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

//Function to update Expense
const updateExpense = async (expenseId, updatedAmount, updatedCategory) => {
  console.log(`[${new Date().toISOString()}] Triggered updateExpense with expenseId: ${expenseId}`);
  if (!expenseId || isNaN(parseFloat(updatedAmount)) || updatedAmount <= 0 || updatedCategory.trim() === "") {
    alert("Please provide valid expense details.");
    return;
  }

  try {
    // Send PUT request to update expense
    const response = await axios.put(`${backEndUrl}/users/${userId}/expenses/${expenseId}`, {
      amount: updatedAmount,
      category: updatedCategory,
    });

    const updatedExpense = response.data;
    // console.log("Updated expense:", updatedExpense);

    // Update the local state with the updated expense details
    setExpenseUser(prevData => {
      if (!prevData || !Array.isArray(prevData.expenses)) {
        console.error("Invalid expense data:", prevData);
        return prevData;
      }

      const updatedExpenses = prevData.expenses.map(expense =>
        expense.id === expenseId
          ? { ...expense, amount: updatedExpense.amount, category: updatedExpense.category }
          : expense
      );

      // console.log("Updated expenses array:", updatedExpenses);
      console.log(`[${new Date().toISOString()}] Updated local expense state:`, updatedExpenses);
      return {
        ...prevData,
        expenses: updatedExpenses,
      };
    });

    setUpdateEditedExpense(previous => !previous);
    // console.log('updatedEditedExpense state:', updateEditedExpense);
    console.log(`[${new Date().toISOString()}] State update: updateEditedExpense toggled`);

    alert("Expense updated successfully!");
    setIsEditingExpense(false);
  } catch (error) {
    console.error("Error updating expense:", error);
    alert("There was an error updating your expense. Please try again.");
  }
};

//Function to delete Expense:
const deleteExpense = async (expenseId) => {
  if (!expenseId) {
      alert("Invalid expense ID.");
      return;
    }
    try {
      // Send DELETE request to backend to remove the expense record
      await axios.delete(`${backEndUrl}/users/${userId}/expenses/${expenseId}`);

      // Update the state to remove the deleted expense
      setExpenseUser(prevData => {
        const expenses = Array.isArray(prevData.expenses) ? prevData.expenses : [];

        const deletedExpense = expenses.find(
          activity => activity.id === expenseId
        );

        if (!deletedExpense) {
          return prevData;
        }

        const newExpenses = expenses.filter(activity => activity.id !== expenseId);
        const newBalance = newExpenses.reduce((total, item) => total + parseFloat(item.amount), 0);

        return {
          ...prevData,
          expenses: newExpenses,
          balance: newBalance
        };
      });

      setDeleteIncome(previous => !previous);

      alert("Income record deleted successfully!");
    } catch (error) {
      console.error("Error deleting income:", error);
      alert("There was an error deleting your income record. Please try again.");
    }
};

  //Get Budget 
  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const response = await axios.get(`${backEndUrl}/users/${userId}/budget`);

        const formattedBudget = {
          ...response.data,
          monthly_income_goal: parseFloat(response.data.monthly_income_goal || 0),
          monthly_expense_goal: parseFloat(response.data.monthly_expense_goal || 0),
          actual_income: parseFloat(response.data.actual_income || 0),
          actual_expenses: parseFloat(response.data.actual_expenses || 0),
        };

        setBudgetUserData(formattedBudget);
        console.log('Budget User Data:', formattedBudget);

      } catch (error) {
        console.error('budget error:', error)
      }
    }

    if(backEndUrl && userId) {
      fetchBudgetData();
    }
  }, [userId, backEndUrl]);


const handleToggleBudget = () => {
  setIsAddingBudget(previous => !previous);
}

//Function to create a budget
const createBudget = async (budgetData) => {
  const {
    monthly_income_goal,
    monthly_expense_goal,
    actual_income,
    actual_expenses,
  } = budgetData;
  console.log("Received Budget Data:", budgetData);
  console.log("Parsed Values:", {
    monthly_income_goal,
    monthly_expense_goal,
    actual_income,
    actual_expenses,
  });


  if (
    !monthly_income_goal ||
    !monthly_expense_goal ||
    !actual_income ||
    !actual_expenses ||
    isNaN(monthly_income_goal) ||
    isNaN(monthly_expense_goal) ||
    isNaN(actual_income) ||
    isNaN(actual_expenses) ||
    monthly_income_goal < 0 ||
    monthly_expense_goal < 0 ||
    actual_income < 0 ||
    actual_expenses < 0
  ) {
    alert("Please provide valid positive numbers for all fields.");
    return;
  }

  setLoading(true); 
  try {
    const response = await axios.post(`${backEndUrl}/users/${userId}/budget`, {
      monthly_income_goal: parseFloat(monthly_income_goal),
      monthly_expense_goal: parseFloat(monthly_expense_goal),
      actual_income: parseFloat(actual_income),
      actual_expenses: parseFloat(actual_expenses),
    });

    const newBudget = {
      budgetId: response.data.budget_id,
      userId: response.data.user_id,
      monthlyIncomeGoal: parseFloat(response.data.monthly_income_goal),
      monthlyExpenseGoal: parseFloat(response.data.monthly_expense_goal),
      actualIncome: parseFloat(response.data.actual_income),
      actualExpenses: parseFloat(response.data.actual_expenses),
      disposableIncome: parseFloat(response.data.disposable_income),
      createdAt: response.data.created_at,
    };

    setUserData((prevData) => ({
      ...(prevData || {}),
      budget: newBudget,
    }));

    alert("Budget created successfully!");
    handleToggleBudget();
  } catch (error) {
    console.error("Error creating budget:", error);
    const errorMessage = error.response?.data?.message || "There was an error creating your budget. Please try again.";
    alert(errorMessage);
  } finally {
    setLoading(false); 
  }
};

//Edit Budget Modal
const handleEditBudget = (budget) => {
  console.log("Budget received in handleEditBudget:", budget);
  const newBudgetToEdit = {
    ...budget,
    monthly_income_goal: parseFloat(budget.monthly_income_goal),
    monthly_expense_goal: parseFloat(budget.monthly_expense_goal),
    actual_income: parseFloat(budget.actual_income),
    actual_expenses: parseFloat(budget.actual_expenses),
  };

  console.log("Setting budgetToEdit in handleEditBudget:", newBudgetToEdit);

  setBudgetToEdit(newBudgetToEdit);
  setIsEditingBudget(true);
};



 
// Function to update budget
  const updateBudget = async (budgetId, updatedBudgetData) => {
    console.log("updatedBudgetData received in updateBudget:", updatedBudgetData);
    console.log('budgetId:', budgetId);
    const {
      monthly_income_goal,
      monthly_expense_goal,
      actual_income,
      actual_expenses,
    } = updatedBudgetData;


    const disposableIncome = monthly_income_goal - monthly_expense_goal;
  
    if (
      isNaN(monthly_income_goal) ||
      isNaN(monthly_expense_goal) ||
      isNaN(actual_income) ||
      isNaN(actual_expenses)
    ) {
      alert("Please provide valid numbers for all fields.");
      return;
    }
  
    try {

      const requestData = {
        monthly_income_goal: parseFloat(monthly_income_goal),
        monthly_expense_goal: parseFloat(monthly_expense_goal),
        actual_income: parseFloat(actual_income),
        actual_expenses: parseFloat(actual_expenses),
        disposable_income: parseFloat(disposableIncome),
      };

      console.log("Request Data budget:", requestData);

      const response = await axios.put(`${backEndUrl}/users/${userId}/budget/${budgetId}`, requestData );
      console.log("Response Data:", response.data);
  
      // Update the state with the updated budget
      setUserData((prevData) => {
        const updatedState = {
          ...prevData,
          budget: {
            ...response.data, 
            disposable_income: parseFloat(response.data.disposable_income), 
          },
        };
        console.log("Updated State:", updatedState);
        return updatedState;
      });
  
      alert("Budget updated successfully!");
    } catch (error) {
      console.error("Error updating budget:", error);
      alert("There was an error updating your budget. Please try again.");
    }
  };

  // Handle Save Budget (create or update)
  const handleSaveBudget = async (budgetData) => {
    try {
      if (budgetUserData.budget_id) {
        // Update existing budget
        await axios.put(`${backEndUrl}/users/${userId}/budget/${budgetUserData.budget_id}`, budgetData);
      } else {
        // Create new budget
        await axios.post(`${backEndUrl}/users/${userId}/budget`, budgetData);
      }
      // Update local state with the latest budget
      const updatedBudget = { ...budgetUserData, ...budgetData };
      setBudgetUserData(updatedBudget);
    } catch (error) {
      console.error("Error saving budget:", error);
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }
  



  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg mt-24">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Financial Dashboard</h1>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Income Section */}
        <IncomeSectionComponent 
         isAddingIncome={isAddingIncome}
         setIsAddingIncome={setIsAddingIncome}
         incomeDescription={incomeDescription}
         setIncomeDescription={setIncomeDescription}
         incomeAmount={incomeAmount}
         setIncomeAmount={setIncomeAmount}
         addIncome={addIncome}
        />

        {/* Expense Section */}
        <ExpenseSectionComponent 
            isAddingExpense={isAddingExpense}
            expenseDescription={expenseDescription}
            setExpenseDescription={setExpenseDescription}
            expenseAmount={expenseAmount}
            setExpenseAmount={setExpenseAmount}
            addExpense={addExpense}
            setIsAddingExpense={setIsAddingExpense}
        />

        {/* Budget Section */}
        <BudgetSectionComponent
          budgetUserData={budgetUserData}
          formatCurrency={formatCurrency}
          createBudget={createBudget}
          newMonthlyIncomeGoal={parseFloat(newMonthlyIncomeGoal) || 0} 
          newMonthlyExpenseGoal={parseFloat(newMonthlyExpenseGoal) || 0}
          newActualIncome={parseFloat(newActualIncome) || 0}
          newActualExpenses={parseFloat(newActualExpenses) || 0}
          handleEditBudget={handleEditBudget}
          handleSaveBudget={handleSaveBudget}
          setBudgetToEdit={setBudgetToEdit}
          setIsEditingBudget={setIsEditingBudget}
        />

      </main>

    {/* Edit Income Modal */}
      <div>
        {isEditingIncome && (
          <IncomeEditModal 
            income={incomeToEdit}
            onClose={() => setIsEditingIncome(false)} 
            onSave={updateIncome}
            onSubmit={(id, amount, source) => updateIncome(id, amount, source)}
          />
        )}
    </div>
  
      {/* Added Income Section */}
      <AddIncomeSectionComponent
        userData={userData || []}
        formatCurrency={formatCurrency}
        totalIncome={totalIncome}
        setIncomeToEdit={setIncomeToEdit}
        setIsEditingIncome={setIsEditingIncome}
        deleteIncome={deleteIncome}
        showAllIncome={showAllIncome}
        setShowAllIncome={setShowAllIncome}
      />



      {/* Edit Expense Modal */}
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

      {/* Added Expense Section */}
      <AddExpenseSectionComponent
          expenseUser={expenseUser}
          userData={userData}
          formatCurrency={formatCurrency}
          totalExpenses={(expenses) => {
            if (!Array.isArray(expenses) || expenses.length === 0) return "$0.00";
          
            const sum = expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);
            return formatCurrency(sum);
          }}
          
          setExpenseToEdit={setExpenseToEdit}
          setIsEditingExpense={setIsEditingExpense}
          deleteExpense={deleteExpense}
          showAllExpense={showAllExpense}
          setShowAllExpense={setShowAllExpense}
      />
 
       {/* Budget Edit Modal */}
    {isEditingBudget && budgetToEdit && (
        <BudgetEditModal
          budget={budgetToEdit} 
          onClose={() => setIsEditingBudget(false)} 
          // onSubmit={(updatedBudgetData) =>
          //   updateBudget(budgetToEdit.budget_id, updatedBudgetData)
          // }
          onSubmit={(updatedBudgetData) => {
            console.log("budgetToEdit:", budgetToEdit);
            console.log("budgetId being sent:", budgetToEdit?.budget_id);
            console.log("updatedBudgetData being sent:", updatedBudgetData);
          
            if (budgetToEdit?.budget_id) {
              updateBudget(budgetToEdit.budget_id, updatedBudgetData);
            } else {
              createBudget(updatedBudgetData);
            }
          }}
          
          
        />
    )}


    </div>
  );
  
  
};


export default DashboardComponent;


