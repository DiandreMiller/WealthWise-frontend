import PropTypes from 'prop-types';
import wealthWise from '../assets/wealthWise.png';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onLogOut, isLogin, toggleState, userId }) => {

  const navigate = useNavigate();
  // console.log('redeploy');

  const handleHomeDirect = (event) => {
    event.preventDefault()
    toggleState()
    // console.log('isLogin navbar state:', isLogin);
    // console.log('userId: nav', userId)

    if(isLogin && userId) {
      // console.log('userId navigate:', userId);
      navigate(`/dashboard/${userId}`);
    } else {
      navigate('/')
    }
  }

  return (
    <nav className="bg-black shadow-md fixed top-0 left-0 w-full z-10">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 flex justify-between items-center py-4">
        {/* Logo */}
        <div className="flex flex-col items-center">
            <img onClick={handleHomeDirect} src={wealthWise} alt="WealthWise Logo" className="w-12 h-12" />
          <div onClick={handleHomeDirect} className="text-xl font-bold text-white mt-2">
            WealthWise
          </div>
        </div>

        {/* Navigation and Login */}
        <div className="flex items-center space-x-8">
          <ul className="flex space-x-8 text-gray-300">
            <li className="hover:text-white transition">
              <a href="/" onClick={handleHomeDirect} className="font-medium">Home</a>
            </li>
            <li className="hover:text-white transition">
              <a href="/about" className="font-medium">About</a>
            </li>
            <li className="hover:text-white transition">
              <a href="/contact" className="font-medium">Contact</a>
            </li>
          </ul>

          {/* Login Button */}

          <button
            onClick={onLogOut}
            className="px-4 py-2 bg-red-500 text-white font-medium rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  onLogOut: PropTypes.func.isRequired,
  isLogin: PropTypes.bool.isRequired,
  toggleState: PropTypes.func.isRequired,
  userId: PropTypes.string,
};

export default Navbar;
