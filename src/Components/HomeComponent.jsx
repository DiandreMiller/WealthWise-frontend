import PropTypes from 'prop-types';
import wealthWise from "../assets/wealthWise.png";
import { Link } from "react-router-dom";

const HomeComponent = ({ darkMode }) => {
  
  return (
    <div className={`flex flex-col min-h-screen  'bg-[rgb(17,24,39)] text-white'`}>
      {/* Header Section */}
      <header className="flex flex-col items-center justify-center pt-32">
        <img src={wealthWise} alt="WealthWise Logo" className="w-48 mb-6" />
        <h1 className="text-4xl font-bold">Welcome to WealthWise</h1>
        <p className="text-lg text-green-500 mt-2">
          Your Companion for Financial Freedom
        </p>
      </header>

      {/* Main Content Section */}
      <main className="flex flex-col items-center justify-center text-center flex-grow px-4 py-12">
        <section className="max-w-3xl mb-12">
          <h2 className="text-3xl font-semibold mb-6">About WealthWise</h2>
          <p className="text-lg">
            WealthWise is your all-in-one platform to track income, expenses,
            and investments. Start building your financial freedom today with
            smart tools and personalized insights.
          </p>
        </section>

        {/* Buttons Section */}
        <section className="mb-16 flex space-x-4">
          <Link to="/learn-more">
            <button className="bg-green-500 hover:bg-green-600 text-white text-lg py-3 px-8 rounded-full transition-all duration-300 w-40">
              Learn More
            </button>
          </Link>
          <Link to="/login-signup">
            <button className="bg-blue-500 hover:bg-blue-600 text-white text-lg py-3 px-8 rounded-full transition-all duration-300 w-40">
              Login
            </button>
          </Link>
        </section>
      </main>
    </div>
  );
};

HomeComponent.propTypes = {
  darkMode: PropTypes.func.isRequired
}

export default HomeComponent;
