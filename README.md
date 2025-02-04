# Budgeting and Investment Recommendation App

Welcome to my **Budgeting and Investment Recommendation App**! This project aims to help users track their finances, calculate their disposable income, and see their changes in spending and income over time.

---

## Features

### **1. User Authentication**
- **Sign Up/Login System**: Secure user authentication.
- **Password Security**: Passwords are hashed for safe storage.
- **Email Verification**: Users verify their email during sign-up.
- **Multi-Factor Authentication (MFA)**: Adds an additional layer of security with a one-time passcode.

### **2. Budget Tracking**
- **Income and Expense Input**: Users can log and categorize their financial data.
- **Disposable Income Calculation**: Automatically calculates disposable income.


### **3. User Dashboard**
- A centralized place to view:
  - Budget summary.
  - Disposable income.

---

## Tech Stack

### **Frontend**
- Built with **React** for a dynamic and responsive user interface.

### **Backend**
- Powered by **Node.js** and **Express** for server-side logic.

### **Database**
- Uses **PostgreSQL** to store user data securely.

---

## Testing

### **Unit Testing**
- Focus on testing individual components and functions.
- Example: Testing disposable income calculations.

### **End-to-End (E2E) Testing**
- Simulates real user workflows like sign-up/login.
- Example: Validating the AI recommendation system.

### **Backend Testing**
- Tests API endpoints and backend logic.
- Tools: Mocha, Chai, and Supertest.

---

## Deployment
The app is deployed with **frontend** and **backend** hosted separately. Links to live environments and deployment details will be provided here:

- **Frontend**: [Frontend Deployment Link](https://icapital-frontend.netlify.app/)
- **Backend**: [Backend Deployment Link](https://icapital-financial-planner-backend.onrender.com/)
- **Trello**: [Trello Link](https://trello.com/b/0KZf9ePw/icapital)

---

## Setup Instructions

### **Prerequisites**
- Node.js (v16 or higher)
- PostgreSQL

### **Installation**
1. Clone the repository:
   ```bash
   git clone https://github.com/DiandreMiller/WealthWise-frontend.git
   cd WealthWise-frontend

2. Install dependencies:
    ```bash
    npm install


3. Navigate to the frontend directory and start the client. You should be running on local host 5173:
    ```bash
    npm run dev

4. Create a .env in the root directory of your project, and use this environmental variable name:
    ```bash
    VITE_REACT_APP_BACKEND_API=http://localhost:4444

5. Happy Hacking!!!!

To-Do fix recurring income starting friday
