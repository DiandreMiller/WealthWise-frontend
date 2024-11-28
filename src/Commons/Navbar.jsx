const Navbar = () => {
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-10">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 flex justify-between items-center py-4">
        {/* Logo Section */}
        <div className="text-xl font-bold text-gray-800">
          iCapital
        </div>

        {/* Nav Links */}
        <ul className="flex space-x-8 text-gray-600">
          <li className="hover:text-gray-900 transition">
            <a href="#home" className="font-medium">Home</a>
          </li>
          <li className="hover:text-gray-900 transition">
            <a href="#about" className="font-medium">About</a>
          </li>
          <li className="hover:text-gray-900 transition">
            <a href="#contact" className="font-medium">Contact</a>
          </li>
        </ul>

        {/* Login Button */}
        <button
          className="ml-4 px-4 py-2 text-white font-medium rounded-md"
          style={{ backgroundColor: 'rgb(1, 119, 170)' }}
        >
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
