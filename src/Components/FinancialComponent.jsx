import axios from "axios";
import { useState } from "react";

const FinancialComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [financeError, setFinanceError] = useState(null);

  const backEndUrl = import.meta.env.VITE_REACT_APP_BACKEND_API;

  // Function to fetch stock symbol if a company name is entered
  const fetchStockSymbol = async (companyName) => {
    try {
      console.log(`Fetching stock symbol for company: ${companyName}`);
      const searchResponse = await axios.get(`${backEndUrl}/finances/search`, {
        params: { companyName },
      });
  
      if (searchResponse.data?.symbol) {
        console.log(`Found stock symbol: ${searchResponse.data.symbol}`);
        return searchResponse.data.symbol.toUpperCase();
      } else {
        throw new Error("No stock symbol found for the given company name.");
      }
    } catch (error) {
      console.error("Error fetching stock symbol:", error);
      throw new Error("Could not retrieve stock symbol. Try entering the stock ticker.");
    }
  };
  

  // Function to fetch financial data
  const fetchFinancialData = async () => {
    if (!searchQuery.trim()) {
      setFinanceError("Please enter a stock symbol or company name.");
      return;
    }
  
    setLoading(true);
    setFinanceError(null);
  
    try {
      let stockSymbol = searchQuery.toUpperCase(); // Convert input to uppercase
  
      // ✅ Debugging: Check raw user input
      console.log("Raw user input:", searchQuery);
  
      // ✅ Fix condition to properly detect company names
      console.log("Checking if input is a company name or stock symbol:", searchQuery);
      if (!/^[A-Z0-9.-]+$/.test(stockSymbol)) {
        console.log(`"${searchQuery}" looks like a company name. Fetching stock symbol...`);
        try {
          stockSymbol = await fetchStockSymbol(searchQuery); // ✅ Force conversion
          console.log(`Mapped company "${searchQuery}" to stock symbol: ${stockSymbol}`);
        } catch (error) {
          setFinanceError(error.message);
          setLoading(false);
          return;
        }
      }
  
      if (!stockSymbol) {
        setFinanceError("Could not determine a valid stock symbol.");
        setLoading(false);
        return;
      }
  
      // ✅ Debugging: Ensure correct symbol is used
      console.log("Using stock symbol for financial data request:", stockSymbol);
  
      const params = {
        symbol: stockSymbol,
        startDate: "2024-01-01",
        endDate: "2024-02-01",
        interval: "1d",
      };
  
      console.log("Sending API request to backend:", `${backEndUrl}/finances`, params);
  
      const response = await axios.get(`${backEndUrl}/finances`, { params });
  
      if (response.status === 200 && response.data) {
        setFinancialData(response.data);
        console.log("Financial Data:", response.data);
      } else {
        throw new Error("No data found.");
      }
    } catch (error) {
      setFinanceError(error.message || "Failed to fetch financial data. Please try again.");
      console.error("Axios Error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Stock Market Data
        </h1>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Enter stock symbol or company name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={fetchFinancialData}
            disabled={loading}
            className={`px-4 py-2 text-white font-medium rounded-lg transition-all ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>

        {financeError && <p className="mt-3 text-sm text-red-600 text-center">{financeError}</p>}

        {financialData && (
          <div className="mt-6 p-4 border rounded-lg shadow-sm bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">
              {financialData.meta.longName} ({financialData.meta.symbol})
            </h2>
            <p className="text-gray-600">
              Current Price:{" "}
              <span className="font-semibold text-gray-900">${financialData.meta.regularMarketPrice}</span>
            </p>
            <p className="text-gray-600">
              52-Week High:{" "}
              <span className="font-semibold text-green-600">${financialData.meta.fiftyTwoWeekHigh}</span>
            </p>
            <p className="text-gray-600">
              52-Week Low:{" "}
              <span className="font-semibold text-red-600">${financialData.meta.fiftyTwoWeekLow}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialComponent;
