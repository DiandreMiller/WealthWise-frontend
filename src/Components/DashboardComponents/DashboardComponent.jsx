import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import DOMPurify from 'dompurify';
import IncomeEditModal from './IncomeEditModal';
import ExpenseEditModal from './ExpenseEditModal';
import IncomeSectionComponent from "./IncomeSectionComponent";
import ExpenseSectionComponent from "./ExpenseSectionComponent";
import BudgetSectionComponent from "./BudgetSectionComponent";
import AddIncomeSectionComponent from "./AddIncomeSectionComponent";
import AddExpenseSectionComponent from "./AddExpenseSectionComponent";
import BudgetEditModal from './BudgetEditModal';
import IncomeOrExpenseGoalAchievedModal from "./IncomeOrExpenseGoalAchievedModal";
import MonthlyActivityComponent from "../MonthlyActivityComponent";




const DashboardComponent = () => {
  //User ID
  const { userId } = useParams();

  //Income
  const [userData, setUserData] = useState([]);
  const [updatedIncome, setUpdatedIncome] = useState(null);
  const [isAddingIncome, setIsAddingIncome] = useState(false);
  const [incomeDescription, setIncomeDescription] = useState("");
  const [incomeCategory, setIncomeCategory] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [showAllIncome, setShowAllIncome] = useState(false);
  const [isEditingIncome, setIsEditingIncome] = useState(false); 
  const [incomeToEdit, setIncomeToEdit] = useState(null); 
  const [updateEditedIncome, setUpdateEditedIncome] = useState(false);
  const [deletedIncome, setDeleteIncome] = useState(false);
  const [filteredIncome, setFilteredIncome] = useState([]);
  const [currentMonthIncome, setCurrentMonthIncome] = useState(0);
  const [isRecurringIncome, setIsRecurringIncome] = useState(null);
  const [previousMonthIncome, setPreviousMonthIncome] = useState(0);
  const [processedRecurringIncome, setProcessedRecurringIncome] = useState(false);

  //Expenses
  const [showAllExpense, setShowAllExpense] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseUser, setExpenseUser] = useState({ expenses: [] });
  const [expenseCategories, setExpenseCategories] = useState('');
  const [isRecurringExpense, setIsRecurringExpense] = useState(null);
  const [filteredExpense, setFilteredExpense] = useState([]);
  const [isEditingExpense, setIsEditingExpense] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [updateEditedExpense, setUpdateEditedExpense] = useState(false);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState(0);
  const [previousMonthExpenses, setPreviousMonthExpenses] = useState(0);
  const [processedRecurringExpense, setProcessedRecurringExpense] = useState(false);

  //Budget
  const [budgetUserData, setBudgetUserData] = useState({});
  const [isAddingBudget, setIsAddingBudget] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState(null);
  const [refreshBudget, setRefreshBudget] = useState(false);
  const [showBudgetEditModal, setShowBudgetEditModal] = useState(false); 


  //Month

  const [currentMonth, setCurrentMonth] = useState('');
  const [getPreviousMonth, setGetPreviousMonth] = useState('');

  //Goals
  const [showGoalModal, setShowGoalModal] = useState(false);
  const goalProcessedRef = useRef(false);

  //Loading
  const [loading, setLoading] = useState(true);

  //Username
  const [userName, setUserName] = useState('');

  //Backend URL
  const backEndUrl = import.meta.env.VITE_REACT_APP_BACKEND_API;

  //Get User
  useEffect(() => {
    const fetchUser = async () => {
      try{
        const response = await axios.get(`${backEndUrl}/users/${userId}`);
        const userObject = response.data;
        // console.log('userObject:', userObject);
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

        // console.log("Formatted User Data:", formattedData.map((person) => person.amount));
        // console.log("Type of User Data:", typeof formattedData);

        setUserData(formattedData);
        // console.log("User data fetched:", formattedData);
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
            // console.log("Fetching expenses...");
            const response = await axios.get(`${backEndUrl}/users/${userId}/expenses`);
            // console.log("Fetched data:", response.data);
            const expenses = response.data.map((expense) => ({
              ...expense,
              amount: parseFloat(expense.amount),
            }));
            // console.log('Fetched expenses:', expenses);

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
      // console.log("Re-fetching expenses...");
      fetchExpensesData();
    }
  }, [userId, backEndUrl, updateEditedExpense]);

  //Function to Format money
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
  
    try {
      // Send PUT request to update income
      const response = await axios.put(`${backEndUrl}/users/${userId}/income/${incomeId}`, {
        amount: DOMPurify.sanitize(updatedAmount),
        source: DOMPurify.sanitize(updatedSource),
        category: incomeCategory,
        is_recurring: isRecurringIncome
      });
  
      const updatedIncome = response.data;
      // console.log("Updated income:", updatedIncome);
  
      setUserData(prevData => {

        if(!prevData || !Array.isArray(prevData.income)) {
          console.error("Invalid income data:", prevData);
          return prevData;
        }

        const updatedIncomes = prevData.income.map(income =>
          income.id === incomeId
            ? { ...income, amount: updatedIncome.amount, source: updatedIncome.source, category: updatedIncome.category, is_recurring: updateIncome.is_recurring }
            : income
        );
  
        return {
          ...prevData,
          income: updatedIncomes,
        };
      });

      setUpdateEditedIncome(previous => !previous);
      // console.log('UpdateEditedIncome:', updateEditedIncome);
  
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

    if (isNaN(amount) || amount <= 0 || incomeDescription.trim() === "" || !incomeCategory) {
        alert("Please provide valid income description, amount and category.");
        return;
    }

    // console.log("Selected category Dashboard:", incomeCategory);
    // console.log("Preparing to add income with the following details:");
    // console.log("Description:", incomeDescription);
    // console.log("Amount:", amount);
    // console.log("Category:", incomeCategory);
    // console.log("Selected Category before POST:", incomeCategory);


    const dateReceived = new Date().toLocaleDateString("en-CA"); // Format: YYYY-MM-DD


    try {
        const response = await axios.post(`${backEndUrl}/users/${userId}/income`, {
            user_id: userId,
            amount: DOMPurify.sanitize(amount.toFixed(2)), 
            source: DOMPurify.sanitize(incomeDescription),
            date_received: dateReceived,
            created_at: new Date().toISOString(), 
            category: DOMPurify.sanitize(incomeCategory),
            is_recurring: isRecurringIncome
        });

        // console.log("Response add income:", response);

        // Update user data 
        setUserData((prevData) => {
            // console.log("prevData:", prevData);
            const newIncome = {
                id: response.data.id, 
                user_id: userId,
                amount: parseFloat(amount.toFixed(2)),
                source: incomeDescription,
                date_received: dateReceived,
                created_at: new Date().toISOString(),
                category: incomeCategory,
                is_recurring: isRecurringIncome,
                User: prevData?.User || null, 
            };

            return [...prevData, newIncome]; 
        });

        // Reset form fields
        setIncomeDescription("");
        setIncomeAmount("");
        setIncomeCategory("");
        setIsAddingIncome(false);
        setIsRecurringIncome(false);
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
  // console.log('user data Expense check:', expenseUser);
  const amount = parseFloat(expenseAmount);

  if (isNaN(amount) || amount <= 0 || expenseDescription.trim() === "") {
    alert("Please provide a valid expense description and amount.");
    return;
  }

  const dateIncurred = new Date().toLocaleDateString("en-CA"); // Format: YYYY-MM-DD

  // console.log("Attempting to add expense with details:", {
  //   userId,
  //   amount,
  //   category: expenseDescription,
  //   dateIncurred,
  // });

  try {
    const response = await axios.post(`${backEndUrl}/users/${userId}/expenses`, {
      user_id: DOMPurify.sanitize(userId),
      amount: DOMPurify.sanitize(amount.toFixed(2)),
      category: DOMPurify.sanitize(expenseDescription),
      category_type: expenseCategories,
      is_recurring: isRecurringExpense,
      date_incurred: dateIncurred,

      created_at: new Date().toISOString(),
    });

    // console.log("Response add expense:", response.data);

    setExpenseUser((prevData) => {
      // console.log("prevData before adding expense:", prevData);

      const newExpense = {
        id: response.data.id,
        user_id: userId,
        amount: parseFloat(amount.toFixed(2)),
        category: expenseDescription,
        category_type: expenseCategories,
        is_recurring: isRecurringExpense,
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
  // console.log(`[${new Date().toISOString()}] Triggered updateExpense with expenseId: ${expenseId}`);
  if (!expenseId || isNaN(parseFloat(updatedAmount)) || updatedAmount <= 0 || updatedCategory.trim() === "") {
    alert("Please provide valid expense details.");
    return;
  }

  try {
    // Send PUT request to update expense
    const response = await axios.put(`${backEndUrl}/users/${userId}/expenses/${expenseId}`, {
      amount: DOMPurify.sanitize(updatedAmount),
      category: DOMPurify.sanitize(updatedCategory),
      category_type: expenseCategories,
      is_recurring: isRecurringExpense ? true : false,
    });

    const updatedExpense = response.data;

    setExpenseUser(prevData => {
      if (!prevData || !Array.isArray(prevData.expenses)) {
        console.error("Invalid expense data:", prevData);
        return prevData;
      }

      const updatedExpenses = prevData.expenses.map(expense =>
        expense.id === expenseId
          ? { ...expense, amount: updatedExpense.amount, category: updatedExpense.category, category_type: updatedExpense.category_type, is_recurring: updateEditedExpense.is_recurring }
          : expense
      );

      // console.log(`[${new Date().toISOString()}] Updated local expense state:`, updatedExpenses);
      return {
        ...prevData,
        expenses: updatedExpenses,
      };
    });

    setUpdateEditedExpense(previous => !previous);
    // console.log(`[${new Date().toISOString()}] State update: updateEditedExpense toggled`);

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
        // console.log('Budget User Data:', formattedBudget);

      } catch (error) {
        console.error('budget error:', error)
      }
    }

    if(backEndUrl && userId) {
      fetchBudgetData();
    }
    
  }, [userId, backEndUrl, refreshBudget, expenseUser, userData]);


//Toggle budget modal
const handleToggleBudget = () => {
  setIsAddingBudget(previous => !previous);
  setRefreshBudget((prev) => !prev)
}

//Function to create a budget
const createBudget = async (budgetData) => {
  const {
    monthly_income_goal,
    monthly_expense_goal,
    actual_income = userData?.amount || 0, 
    actual_expenses = expenseUser?.expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0, 
  } = budgetData;

  // console.log("=== createBudget Function Start ===");
  // console.log("Received Budget Data:", budgetData);
  // console.log("Parsed Values Before Validation:", {
  //   monthly_income_goal,
  //   monthly_expense_goal,
  //   actual_income,
  //   actual_expenses,
  // });

  // Validate inputs
  if (
    isNaN(monthly_income_goal) ||
    isNaN(monthly_expense_goal) ||
    isNaN(actual_income) ||
    isNaN(actual_expenses) ||
    monthly_income_goal < 0 ||
    monthly_expense_goal < 0 ||
    actual_income < 0 ||
    actual_expenses < 0
  ) {
    console.error("Validation Error: Invalid input data.");
    console.error("Validation Details:", {
      isNaNMonthlyIncomeGoal: isNaN(monthly_income_goal),
      isNaNMonthlyExpenseGoal: isNaN(monthly_expense_goal),
      isNaNActualIncome: isNaN(actual_income),
      isNaNActualExpenses: isNaN(actual_expenses),
      negativeMonthlyIncomeGoal: monthly_income_goal < 0,
      negativeMonthlyExpenseGoal: monthly_expense_goal < 0,
      negativeActualIncome: actual_income < 0,
      negativeActualExpenses: actual_expenses < 0,
    });
    alert("Please provide valid positive numbers for all fields.");
    return;
  }

  setLoading(true);
  try {
    // console.log("Sending API Request to Create Budget...");
    // console.log("API Request Payload:", {
    //   monthly_income_goal: DOMPurify.sanitize(parseFloat(monthly_income_goal)),
    //   monthly_expense_goal: DOMPurify.sanitize(parseFloat(monthly_expense_goal)),
    //   actual_income: actual_income,
    //   actual_expenses: actual_expenses,
    // });

    const response = await axios.post(`${backEndUrl}/users/${userId}/budget`, {
      monthly_income_goal: DOMPurify.sanitize(parseFloat(monthly_income_goal)),
      monthly_expense_goal: DOMPurify.sanitize(parseFloat(monthly_expense_goal)),
      actual_income: parseFloat(actual_income),
      actual_expenses: parseFloat(actual_expenses),
    });

    // console.log("API Response:", response.data);
    // console.log("type: month goal", response.data.monthly_income_goal);
    // console.log("type: month expense", response.data.monthly_expense_goal);
    // console.log("type: actual income", response.data.actual_income);
    // console.log("type: actual expense", response.data.actual_expenses);

    setBudgetUserData((prevData) => ({
      ...(prevData || {}),
      budget: { ...response.data },
      income: prevData.income,
    }));

    alert("Budget created successfully!");
    handleToggleBudget();
  } catch (error) {
    console.error("Error creating budget:", error);
    console.error("Error Details:", {
      message: error.message,
      responseData: error.response?.data,
      status: error.response?.status,
    });
    const errorMessage = error.response?.data?.message || "There was an error creating your budget. Please try again.";
    alert(errorMessage);
  } finally {
    setLoading(false);
    console.log("=== createBudget Function End ===");
  }
};



//Edit Budget Modal
const handleEditBudget = (budget) => {
  // console.log("Budget received in handleEditBudget:", budget);
  const newBudgetToEdit = {
    ...budget,
    monthly_income_goal: DOMPurify.sanitize(parseFloat(budget.monthly_income_goal)),
    monthly_expense_goal: DOMPurify.sanitize(parseFloat(budget.monthly_expense_goal)),
    actual_income: DOMPurify.sanitize(parseFloat(budget.actual_income)),
    actual_expenses: DOMPurify.sanitize(parseFloat(budget.actual_expenses)),
  };

  // console.log("Setting budgetToEdit in handleEditBudget:", newBudgetToEdit);

  handleToggleBudget();
  setBudgetToEdit(newBudgetToEdit);
  setIsEditingBudget(true);
  setShowBudgetEditModal(true);
};

 
// Function to update budget
const updateBudget = async (budgetId, updatedBudgetData) => {
  console.log('update budget involked')

  try {
    const requestData = {
      monthly_income_goal: parseFloat(updatedBudgetData.monthly_income_goal),
      monthly_expense_goal: parseFloat(updatedBudgetData.monthly_expense_goal),
      actual_income: parseFloat(updatedBudgetData.actual_income),
      actual_expenses: parseFloat(updatedBudgetData.actual_expenses),
      // disposable_income: parseFloat(updatedBudgetData.monthly_income_goal) - parseFloat(updatedBudgetData.monthly_expense_goal),
    };

    console.log("Request Data budget:", requestData);

    const response = await axios.put(`${backEndUrl}/users/${userId}/budget/${budgetId}`, requestData);
    console.log("Response Data:", response.data);


    console.log("Entering setTimeout block for GET request");
  
    setTimeout(async () => {
      try {
        console.log("GET request started for updated budget");
        const response1 = await axios.get(`${backEndUrl}/users/${userId}/budget/${budgetId}`);
        setBudgetUserData(response1.data);
        console.log("Updated budgetUserData (from GET):", response1.data);
      } catch (error) {
        console.error("Error fetching updated budget (GET request failed):", error.response || error.message || error);
      }
    }, 500);
    
  //   setBudgetUserData({
  //     budget_id: response.data.budget_id,
  //     user_id: response.data.user_id,
  //     monthly_income_goal: parseFloat(response.data.monthly_income_goal),
  //     monthly_expense_goal: parseFloat(response.data.monthly_expense_goal),
  //     actual_income: parseFloat(response.data.actual_income),
  //     actual_expenses: parseFloat(response.data.actual_expenses),
  //     disposable_income: parseFloat(response.data.disposable_income),
  //   });
    
  //   console.log("Updated budgetUserData:", {
  //     budget_id: response.data.budget_id,
  //     user_id: response.data.user_id,
  //     monthly_income_goal: parseFloat(response.data.monthly_income_goal),
  //     monthly_expense_goal: parseFloat(response.data.monthly_expense_goal),
  //     actual_income: parseFloat(response.data.actual_income),
  //     actual_expenses: parseFloat(response.data.actual_expenses),
  //     disposable_income: parseFloat(response.data.disposable_income),
  //  });


    alert("Budget updated successfully!");
    handleToggleBudget();
  } catch (error) {
    console.error("Error updating budget:", error);
    alert("There was an error updating your budget. Please try again.");
  }
};


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

  //Get goal achieved
  useEffect(() => {

    const goalAchieved = checkIfIncomeOrExpenseAchieved(budgetUserData, budgetUserData, userData || [], expenseUser)

    if(goalAchieved && !goalProcessedRef.current) {
      setShowGoalModal(true);
      goalProcessedRef.current = true;
    }

  },[budgetUserData, userData, expenseUser])

  //Close modal
  const handleCloseModal = () => {
    setShowGoalModal(false);
    goalProcessedRef.current = true; 
  };


  // Get current month
  const getMonth = () => {

    const monthMap = new Map([
        ['01', 'January'],
        ['02', 'February'],
        ['03', 'March'],
        ['04', 'April'],
        ['05', 'May'],
        ['06', 'June'],
        ['07', 'July'],
        ['08', 'August'],
        ['09', 'September'],
        ['10', 'October'],
        ['11', 'November'],
        ['12', 'December']
      ]);
      
    
    const formattedDate = new Date().toLocaleDateString("en-CA");
    const getMonthNumber = formattedDate.slice(5,7);

    let month = '';

    for(let [keys, values] of monthMap) {
        if(keys === getMonthNumber) {
            month += values
        }
    }

  //  console.log('month:', month);
    setCurrentMonth(month);
    
  }

  // Call get month function
  useEffect(() => {
    getMonth();
}, []); 

  //Function to get income for a specific month
  const getSpecificMonthIncome = useCallback(() => {
    if (!currentMonth) {
      return;
    };

    const filteredIncomes = userData.filter((income) => {
      const incomeMonth = new Date(`${income.date_received}T00:00:00Z`).toLocaleString("en-US", { month: "long", timeZone: "UTC" }).toLowerCase();
      // console.log('Raw Date:', income.date_received);
      // console.log('Parsed Date:', new Date(`${income.date_received}T00:00:00Z`).toISOString());
      // console.log('Parsed Month (UTC):', incomeMonth);
      return currentMonth.toLowerCase() === incomeMonth;
    });

    
    
    
    setFilteredIncome(filteredIncomes);
    // console.log('filteredIncomes:', filteredIncomes);
    const totalIncome = filteredIncomes.reduce((total, income) => total + income.amount, 0);
    setCurrentMonthIncome(totalIncome);
}, [currentMonth, userData]);


  // Get Monthly income
  useEffect(() => {
    getSpecificMonthIncome();
  }, [getSpecificMonthIncome]);


  // Get previous month
  useEffect(() => {
    
    const previousMonth = () => {
  
      const allMonths = ['January', 'February', 'March', 'April', 'May', 'June',
       'July', 'August', 'September', 'October', 'November', 'December'];
  
       
      //  console.log('dashboard:', currentMonth);
  
       let monthBeforeCurrent = '';
  
       for(let i = 0; i < allMonths.length; i++) {
        if(currentMonth === allMonths[i] && currentMonth !== 'January') {
          monthBeforeCurrent = allMonths[i - 1];
        } else {
          monthBeforeCurrent = 'December';
        }
       }
       setGetPreviousMonth(monthBeforeCurrent);
      //  console.log('monthBeforeCurrent', monthBeforeCurrent);
    }
    previousMonth();
  },)

  
// Function to get expenses for a specific month
const getSpecificMonthExpense = useCallback(() => {
    if (!currentMonth) {
      return;
    };

    const filteredExpenses = expenseUser.expenses.filter((expenses) => {
      const expensesMonth = new Date(`${expenses.date_incurred}T00:00:00Z`).toLocaleString("en-US", { month: "long", timeZone: "UTC" }).toLowerCase();
      // console.log('expensesMonth:', expensesMonth);
        return expensesMonth === currentMonth.toLowerCase();
    });

    setFilteredExpense(filteredExpenses);
    const totalExpenses = filteredExpenses.reduce((total, expenses) => total + expenses.amount, 0);
    setCurrentMonthExpenses(totalExpenses);
}, [currentMonth, expenseUser]);


 // Get Monthly expense
 useEffect(() => {
  getSpecificMonthExpense();
}, [getSpecificMonthExpense]);


// Get previous month's expenses
useEffect(() => {


  const previousMonthExpensesFunction = () => {

    const monthMap = new Map([
      ['01', 'January'],
      ['02', 'February'],
      ['03', 'March'],
      ['04', 'April'],
      ['05', 'May'],
      ['06', 'June'],
      ['07', 'July'],
      ['08', 'August'],
      ['09', 'September'],
      ['10', 'October'],
      ['11', 'November'],
      ['12', 'December']
    ]);

    const monthMapArray = Array.from(monthMap.values());

    let monthNumber = '';
  
    if(monthMapArray) {
      for(let [keys, values] of monthMap) {
        monthNumber = keys;
      }
    }

    const filteredExpensesFromPreviousMonth = expenseUser.expenses.filter((expense) => {
      return expense.date_incurred.slice(5,7) === monthNumber;
    })

    const totalExpensesForPreviousMonth = filteredExpensesFromPreviousMonth.map((cost) => cost.amount).reduce((a,b) => a + b, 0);
    setPreviousMonthExpenses(totalExpensesForPreviousMonth);
  };

  previousMonthExpensesFunction();
}, [getPreviousMonth, currentMonth, expenseUser.expenses, previousMonthExpenses]);


// Get previous month's income
useEffect(() => {

  const previousMonthIncomeFunction = () => {

    const monthMap = new Map([
      ['01', 'January'],
      ['02', 'February'],
      ['03', 'March'],
      ['04', 'April'],
      ['05', 'May'],
      ['06', 'June'],
      ['07', 'July'],
      ['08', 'August'],
      ['09', 'September'],
      ['10', 'October'],
      ['11', 'November'],
      ['12', 'December']
    ]);
  
    const monthMapArray = Array.from(monthMap.values());

    let monthNumber = '';

    if(monthMapArray) {
      for(let [keys, values] of monthMap) {
        monthNumber = keys;
      }
    }

    const filteredIncomeFromPreviousMonth = userData.filter((userData) => {
      return userData.date_received.slice(5,7) === monthNumber;
    })

    // console.log('testest:', userData);

    const totalIncomeForPreviousMonth = filteredIncomeFromPreviousMonth.map((cost) => cost.amount).reduce((a,b) => a + b, 0);
    setPreviousMonthIncome(totalIncomeForPreviousMonth);
    // console.log('previousMonthIncome:', previousMonthIncome);
  };

  previousMonthIncomeFunction();
}, [getPreviousMonth, currentMonth, userData, previousMonthIncome]);


//Check if income is recurring
useEffect(() => {
  const recurringIncome = () => {
    // console.log("userData before filtering:", userData);
    const incomeThatIsRecurring = userData.filter((income) => income.is_recurring);
    // console.log('test11:', incomeThatIsRecurring);

    // console.log('id:', expenseUser.expenses.map((test) => test.id))


    
    const today = new Date();
    const currentYear = today.getFullYear();
    const endMonth = 11; 

    const generateMonthlyIncome = (income) => {
      // console.log('generate Income function invoked:');
      const startDate = new Date(income.date_received);
      if (isNaN(startDate)) {
        console.error(`Invalid date_received for income:`, income);
        return [];
      }
    
      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth();
    
      const recurringIncomeEntries = [];
      // console.log('entries before data:', recurringIncomeEntries);
    
      for (let year = startYear; year <= currentYear; year++) {
        const start = year === startYear ? startMonth : 0;
        const end = year === currentYear ? endMonth : 11;
    
        for (let month = start; month <= end; month++) {
          const newDate = new Date(year, month, 1).toISOString().split('T')[0]; 
    
          recurringIncomeEntries.push({
            ...income,
            date_received: newDate,
            key: `${income.id}-${newDate}`,
          });
        }
      }
      // console.log('recurringIncomeEntries1:', recurringIncomeEntries);
      return recurringIncomeEntries;
    };

    const updatedRecurringIncome = incomeThatIsRecurring.flatMap(generateMonthlyIncome);
  


    // Filter for February Test
    const februaryEntries = updatedRecurringIncome.filter((entry) => {
      const month = new Date(entry.date_received).getMonth(); 
      return month === 1; 
    });

  
    // console.log("Entries for February:", februaryEntries);
    // console.log("Updated Recurring Income:", updatedRecurringIncome);

      // Filter for March Test
      const marchEntries = updatedRecurringIncome.filter((entry) => {
        const month = new Date(entry.date_received).getMonth(); 
        return month === 1; 
      });

      // console.log('marchEntries:', marchEntries);

    if (processedRecurringIncome) {
      // console.log('processedRecurringIncome:', processedRecurringIncome);
      return;
    } 

    setUserData((prevData) => {
      const nonRecurringIncome = prevData.filter((income) => !income.is_recurring);
      return [...nonRecurringIncome, ...updatedRecurringIncome];
    });

   

    setProcessedRecurringIncome(true); 
  };

  recurringIncome();
}, [userData, processedRecurringIncome, filteredIncome]); 

//Check if expense is recurring
useEffect(() => {
  const recurringExpenses = () => {
    // console.log("expenses before filtering:", expenseUser.expenses);
    const expenseThatIsRecurring = expenseUser.expenses.filter((expense) => expense.is_recurring);
    // console.log('expenseUser.expenses', expenseThatIsRecurring);

    const today = new Date();
    const currentYear = today.getFullYear();
    const endMonth = 11; 

    const generateMonthlyExpense = (expense) => {
      // console.log('generate expense function invoked:')
      const startDate = new Date(expense.date_incurred
      );
      if (isNaN(startDate)) {
        console.error(`Invalid date_received for expense:`, expense);
        return [];
      }
    
      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth();
    
      const recurringExpenseEntries = [];
      // console.log('entries before data:', recurringExpenseEntries);
    
      for (let year = startYear; year <= currentYear; year++) {
        const start = year === startYear ? startMonth : 0;
        const end = year === currentYear ? endMonth : 11;
    
        for (let month = start; month <= end; month++) {
          const newDate = new Date(year, month, 1).toISOString().split('T')[0]; 
    
          recurringExpenseEntries.push({
            ...expense,
            date_incurred: newDate,
            key: `${expense.id}-${newDate}`,
          });
        }
      }
      // console.log('recurringExpenseEntries1:', recurringExpenseEntries);
      return recurringExpenseEntries;
    };

    const updatedRecurringExpense = expenseThatIsRecurring.flatMap(generateMonthlyExpense);

    // Filter for February Test
    const februaryEntries = updatedRecurringExpense.filter((entry) => {
      const month = new Date(entry.date_incurred).getMonth(); 
      return month === 1; 
    });

  
    // console.log("Entries for February expense:", februaryEntries);
    // console.log("Updated Recurring Expense:", updatedRecurringExpense);

      // Filter for March Test
      const marchEntries = updatedRecurringExpense.filter((entry) => {
        const month = new Date(entry.date_incurred).getMonth(); 
        return month === 2; 
      });

      // console.log('marchEntries expenses:', marchEntries);

      if (processedRecurringExpense) {
        // console.log('processedRecurringExpense:', processedRecurringExpense);
        return;
      } 


      setExpenseUser((prevData) => ({
        ...prevData,
        expenses: [
          ...prevData.expenses.filter((expense) => !expense.is_recurring),
          ...updatedRecurringExpense,
        ],
      }));
      

      setProcessedRecurringExpense(true); 

  }
  recurringExpenses();
},[expenseUser.expenses, processedRecurringExpense])


//If data is loading
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
         incomeCategory={incomeCategory} 
         setIncomeCategory={setIncomeCategory}
         isRecurringIncome={isRecurringIncome}
         setIsRecurringIncome={setIsRecurringIncome}
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
            expenseCategories={expenseCategories}
            setExpenseCategories={setExpenseCategories}
            isRecurringExpense={isRecurringExpense}
            setIsRecurringExpense={setIsRecurringExpense}
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
            onSubmit={(id, amount, source, category, is_recurring) => updateIncome(id, amount, source, category, is_recurring)}
          />
        )}
    </div>

    <div>
      <MonthlyActivityComponent
        currentMonth={currentMonth}
        currentMonthIncome={currentMonthIncome}
        currentMonthExpenses={currentMonthExpenses}
        showAllIncome={showAllIncome}
        userData={userData}
        filteredIncome={filteredIncome}
        filteredExpense={filteredExpense}
        getPreviousMonth={getPreviousMonth}
        previousMonthExpenses={previousMonthExpenses}
        previousMonthIncome={previousMonthIncome}
        
       />
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
              onSubmit={(id, amount, category, category_type, is_recurring) => updateExpense(id, amount, category, category_type, is_recurring)}

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


export default DashboardComponent;


