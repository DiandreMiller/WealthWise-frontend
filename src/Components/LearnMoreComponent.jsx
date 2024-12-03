const LearnMoreComponent = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-3xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Learn More About WealthWise</h2>
          <p className="text-lg mb-6">
            WealthWise is your ultimate financial companion, designed to help you achieve financial freedom and manage your wealth effortlessly. 
            Whether you&apos;re tracking income and expenses, planning for investments, or simply monitoring your savings, WealthWise provides 
            intuitive tools and personalized insights to keep you on the path to success.
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">
              <span className="font-semibold">Track Income & Expenses:</span> Stay on top of your finances with detailed reports and analytics.
            </li>
            <li className="mb-2">
              <span className="font-semibold">Investment Insights:</span> Get personalized recommendations to maximize your returns.
            </li>
            <li className="mb-2">
              <span className="font-semibold">Budgeting Tools:</span> Create and stick to a budget tailored to your lifestyle.
            </li>
            <li>
              <span className="font-semibold">Secure & Private:</span> Your financial data is encrypted and accessible only to you.
            </li>
          </ul>
          <p className="text-lg mb-6">
            Join the WealthWise community and start building the financial future you deserve. Whether you're a seasoned investor or just starting your journey, 
            WealthWise is here to guide you every step of the way.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="/login-signup">
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 w-40">
                Get Started
              </button>
            </a>
          </div>
        </div>
      </div>
    );
  };
  
  export default LearnMoreComponent;
  