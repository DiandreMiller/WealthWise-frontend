const Footer = () => {
    return (
      <footer className="bg-black text-gray-300 py-6 fixed bottom-0 left-0 w-full">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 flex justify-between items-center">
        
          <div>
            <p className="text-sm">&copy; {new Date().getFullYear()} WealthWise. All rights reserved.</p>
          </div>
  
          <div className="flex space-x-4">
            <a href="#privacy" className="text-gray-300 hover:text-white text-sm transition">
              Privacy Policy
            </a>
            <a href="#terms" className="text-gray-300 hover:text-white text-sm transition">
              Terms of Service
            </a>
            <a href="/contact" className="text-gray-300 hover:text-white text-sm transition">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  