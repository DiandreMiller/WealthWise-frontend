import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import DOMPurify from 'dompurify';
import IncomeEditModal from './DashboardComponents/IncomeEditModal';
import ExpenseEditModal from './DashboardComponents/ExpenseEditModal';
import IncomeSectionComponent from "./DashboardComponents/IncomeSectionComponent";
import ExpenseSectionComponent from "./DashboardComponents/ExpenseSectionComponent";
import BudgetSectionComponent from "./DashboardComponents/BudgetSectionComponent";
import AddIncomeSectionComponent from "./DashboardComponents/AddIncomeSectionComponent";
import AddExpenseSectionComponent from "./DashboardComponents/AddExpenseSectionComponent";
import BudgetEditModal from './DashboardComponents/BudgetEditModal';
import IncomeOrExpenseGoalAchievedModal from "./DashboardComponents/IncomeOrExpenseGoalAchievedModal";



const TestComponent = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState([]);
  const [isAddingIncome, setIsAddingIncome] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [incomeDescription, setIncomeDescription] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseUser, setExpenseUser] = useState({ expenses: [] });
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
  const [refreshBudget, setRefreshBudget] = useState(false);
  const [userName, setUserName] = useState('');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showBudgetEditModal, setShowBudgetEditModal] = useState(false);
  const goalProcessedRef = useRef(false);


  const backEndUrl = import.meta.env.VITE_REACT_APP_BACKEND_API;

  //Get User
  useEffect(() => {
    const fetchUser = async () => {
      try{
        const response = await axios.get(`${backEndUrl}/users/${userId}`);
        const userObject = response.data;
        console.log('userObject:', userObject);
        if(userObject) {
            const name = userObject.username
            const length = name.length;
            const firstLetter = name[0].toUpperCase();
            const restOfUserName = name.slice(1,length);
            const fullUserName = `${firstLetter}${restOfUserName}`
            setUserName(fullUserName);
        }

      } catch (error) {
        console.error(error)
      }
    }

    if (userId && backEndUrl) {
      fetchUser();
    }
  },[backEndUrl, userId])

//Get income
  useEffect(() => {
    const fetchUserIncome = async () => {
      try {
        const response = await axios.get(`${backEndUrl}/users/${userId}/income`);
        const formattedData = response.data.map((income) => ({
          ...income,
          amount: parseFloat(income.amount), 
        }));

        console.log("Formatted User Data:", formattedData.map((person) => person.amount));
        console.log("Type of User Data:", typeof formattedData);

        setUserData(formattedData);
        console.log("User data fetched:", formattedData);
        setUpdatedIncome(response.data);

      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData([]);
      }
    };
  
    if (userId && backEndUrl) {
      fetchUserIncome();
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
        amount: DOMPurify.sanitize(updatedAmount),
        source: DOMPurify.sanitize(updatedSource),
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
            amount: DOMPurify.sanitize(amount.toFixed(2)), 
            source: DOMPurify.sanitize(incomeDescription),
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
        await axios.delete(`${backEndUrl}/users/${userId}/income/${incomeId}`);

        // Remove the deleted income
        setUserData(prevData => {

          const income = Array.isArray(prevData.income) ? prevData.income : [];

          const deletedIncome = income.find(
            activity => activity.id === incomeId
          );
          

          if (!deletedIncome) {
            return prevData;
          }

          const newIncome = income.filter(activity => activity.id !== incomeId);
          const newBalance = newIncome.reduce((total, item) => {
            const amount = parseFloat(item.amount);
            return !isNaN(amount) ? total + amount : total;
          }, 0);
    

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
    const response = await axios.post(`${backEndUrl}/users/${userId}/expenses`, {
      user_id: DOMPurify.sanitize(userId),
      amount: DOMPurify.sanitize(amount.toFixed(2)),
      category: DOMPurify.sanitize(expenseDescription),
      date_incurred: dateIncurred,
      created_at: new Date().toISOString(),
    });

    console.log("Response add expense:", response.data);

    setExpenseUser((prevData) => {
      console.log("prevData before adding expense:", prevData);

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
      amount: DOMPurify.sanitize(updatedAmount),
      category: DOMPurify.sanitize(updatedCategory),
    });

    const updatedExpense = response.data;

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

      console.log(`[${new Date().toISOString()}] Updated local expense state:`, updatedExpenses);
      return {
        ...prevData,
        expenses: updatedExpenses,
      };
    });

    setUpdateEditedExpense(previous => !previous);
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
      //Delete expense 
      await axios.delete(`${backEndUrl}/users/${userId}/expenses/${expenseId}`);

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
    
  }, [userId, backEndUrl, refreshBudget, expenseUser, userData]);


const handleToggleBudget = () => {
  setIsAddingBudget(previous => !previous);
  setRefreshBudget((prev) => !prev)
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
      monthly_income_goal: DOMPurify.sanitize(parseFloat(monthly_income_goal)),
      monthly_expense_goal: DOMPurify.sanitize(parseFloat(monthly_expense_goal)),
      actual_income: DOMPurify.sanitize(parseFloat(actual_income)),
      actual_expenses: DOMPurify.sanitize(parseFloat(actual_expenses)),
    });

    setBudgetUserData((prevData) => ({
      ...(prevData || {}),
      budget: { ...response.data },
      income: prevData.income,
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
    monthly_income_goal: DOMPurify.sanitize(parseFloat(budget.monthly_income_goal)),
    monthly_expense_goal: DOMPurify.sanitize(parseFloat(budget.monthly_expense_goal)),
    actual_income: DOMPurify.sanitize(parseFloat(budget.actual_income)),
    actual_expenses: DOMPurify.sanitize(parseFloat(budget.actual_expenses)),
  };

  console.log("Setting budgetToEdit in handleEditBudget:", newBudgetToEdit);

  handleToggleBudget();
  setBudgetToEdit(newBudgetToEdit);
  setIsEditingBudget(true);
  setShowBudgetEditModal(true);
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
        monthly_income_goal: DOMPurify.sanitize(parseFloat(monthly_income_goal)),
        monthly_expense_goal: DOMPurify.sanitize(parseFloat(monthly_expense_goal)),
        actual_income: DOMPurify.sanitize(parseFloat(actual_income)),
        actual_expenses: DOMPurify.sanitize(parseFloat(actual_expenses)),
        disposable_income: parseFloat(disposableIncome),
      };

      console.log("Request Data budget:", requestData);

      const response = await axios.put(`${backEndUrl}/users/${userId}/budget/${budgetId}`, requestData );
      console.log("Response Data:", response.data);
  
      // Update the state with the updated budget
      setBudgetUserData((prevData) => {
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
  
      handleToggleBudget();
      alert("Budget updated successfully!");
    } catch (error) {
      console.error("Error updating budget:", error);
      alert("There was an error updating your budget. Please try again.");
    }
  };

  //Function to Check if Goals were accomplished or exceeded
  const checkIfIncomeOrExpenseAchieved = (incomeGoal, expenseGoal, incomeActual, expenseActual) => {

    const totalIncome = incomeActual.map((person) => person.amount).reduce((a, b) => a + b, 0);
    const totalExpense = expenseActual.expenses.map((person) => person.amount).reduce((a, b) => a + b, 0);
  
    const monthlyIncomeGoal = incomeGoal.monthly_income_goal;
    const monthlyExpenseGoal = expenseGoal.monthly_expense_goal;
  
    if (totalIncome >= monthlyIncomeGoal && totalExpense <= monthlyExpenseGoal) {
      return "Income & Expense";
    } else if (totalIncome >= monthlyIncomeGoal) {
      return "Income";
    } else if (totalExpense <= monthlyExpenseGoal) {
      return "Expense";
    } else {
      return null; 
    }
  };

  useEffect(() => {

    const goalAchieved = checkIfIncomeOrExpenseAchieved(budgetUserData, budgetUserData, userData || [], expenseUser)

    if(goalAchieved && !goalProcessedRef.current) {
      setShowGoalModal(true);
      goalProcessedRef.current = true;
    }

  },[budgetUserData, userData, expenseUser])

  const handleCloseModal = () => {
    setShowGoalModal(false);
    goalProcessedRef.current = true; 
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
      <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Financial Dashboard</h1>
          <h1 className="text-xl text-blue-600">Welcome {userName}</h1>
        </header>

      </div>

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
          userData={userData || []}
          expenseUser={expenseUser}
          budgetUserData={budgetUserData}
          formatCurrency={formatCurrency}
          handleEditBudget={handleEditBudget}
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
        totalIncome={totalIncome || []}
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
          onClose={() => {
            setIsEditingBudget(false);
            setShowBudgetEditModal(false);
          }} 
          onSubmit={(updatedBudgetData) => {
            console.log("budgetToEdit:", budgetToEdit);
            console.log("budgetId being sent:", budgetToEdit?.budget_id);
            console.log("updatedBudgetData being sent:", updatedBudgetData);
          
            if (budgetToEdit?.budget_id) {
              updateBudget(budgetToEdit.budget_id, updatedBudgetData);
            } else {
              createBudget(updatedBudgetData);
            }
              setIsEditingBudget(false);
              setShowBudgetEditModal(false);
          }}
          
          
        />
    )}

          <div>
            {showGoalModal && (
              <IncomeOrExpenseGoalAchievedModal
                // onClose={() => setShowGoalModal(false)}
                onClose={handleCloseModal}
                onUpdateGoals={() => {
                  setShowGoalModal(false);
                  setShowBudgetEditModal(true);
                  setBudgetToEdit(budgetUserData);
                  setShowBudgetEditModal(true);
                }}
                checkIfIncomeOrExpenseAchieved={checkIfIncomeOrExpenseAchieved}
                budgetUserData={budgetUserData}
                userData={userData || []}
                expenseUser={expenseUser}
                handleEditBudget={handleEditBudget}
              />
            )}
          </div>
    </div>
  );
  
 
};


export default TestComponent;


