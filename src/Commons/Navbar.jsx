import wealthWise from '../assets/wealthWise.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-black shadow-md fixed top-0 left-0 w-full z-10">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 flex justify-between items-center py-4">
        {/* Logo Section */}
        <div className="flex flex-col items-center">
          <Link to='/'>
            <img src={wealthWise} alt="WealthWise Logo" className="w-12 h-12" />
          </Link>
          <div className="text-xl font-bold text-white mt-2">
            WealthWise
          </div>
        </div>

        {/* Navigation and Login */}
        <div className="flex items-center space-x-8">
          {/* Nav Links */}
          <ul className="flex space-x-8 text-gray-300">
            <li className="hover:text-white transition">
              <a href="/" className="font-medium">Home</a>
            </li>
            <li className="hover:text-white transition">
              <a href="/about" className="font-medium">About</a>
            </li>
            <li className="hover:text-white transition">
              <a href="/contact" className="font-medium">Contact</a>
            </li>
          </ul>

          {/* Login Button */}

          <Link to='/login'>

            <button
              className="px-4 py-2 text-white font-medium rounded-md"
              style={{ backgroundColor: 'rgb(59, 129, 246)' }}
            >
              Login
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
