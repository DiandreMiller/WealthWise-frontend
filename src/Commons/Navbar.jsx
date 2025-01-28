import PropTypes from 'prop-types';
import wealthWise from '../assets/wealthWise.png';
import { useNavigate } from 'react-router-dom';
// import { UserContext } from '../Context/UserContext';
// import { useContext } from 'react';

const Navbar = ({ onLogOut, toggleState, userId, darkMode, toggleDarkMode }) => {

  // const { userName } = useContext(UserContext);

  const navigate = useNavigate();

  console.log('userId:', userId);

  const handleHomeDirect = (event) => {
    event.preventDefault();
    toggleState();
    if (userId) {
      navigate(`/dashboard/${userId}`);
    } else {
      navigate('/');
    }
  };

  const handleAuthButtonClick = () => {
    if (userId) {
      onLogOut(); 
    } else {
      navigate('/login-signup'); 
    }
  };

  return (
    <nav className="bg-black shadow-md fixed top-0 left-0 w-full z-10">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 flex justify-between items-center py-4">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <img
            onClick={handleHomeDirect}
            src={wealthWise}
            alt="WealthWise Logo"
            className="w-12 h-12 cursor-pointer"
          />
          <div
            onClick={handleHomeDirect}
            className="text-xl font-bold text-white mt-2 cursor-pointer"
          >
            WealthWise
          </div>
        </div>

        {/* Navigation and Login/Logout */}
        <div className="flex items-center space-x-8">
          <ul className="flex space-x-8 text-gray-300">
            <li className="hover:text-white transition">
              <a href="/" onClick={handleHomeDirect} className="font-medium">
                Home
              </a>
            </li>
            <li className="hover:text-white transition">
              <a href="/about" className="font-medium">
                About
              </a>
            </li>
            <li className="hover:text-white transition">
              <a href="/contact" className="font-medium">
                Contact
              </a>
            </li>
          </ul>

          {/* Login/Logout Button */}
          <button
            onClick={handleAuthButtonClick}
            className={`px-4 py-2 font-medium rounded-md ${
              userId  ? 'hover:bg-red-600 bg-red-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {userId ? 'Logout' : 'Login'}
          </button>
          {userId && (
            <button className='bg-black hover-pointer' onClick={toggleDarkMode}>
              {darkMode ? '☀' : '☾'}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  onLogOut: PropTypes.func.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
  toggleState: PropTypes.func.isRequired,
  darkMode: PropTypes.func.isRequired,
  userId: PropTypes.string, 
};

export default Navbar;
