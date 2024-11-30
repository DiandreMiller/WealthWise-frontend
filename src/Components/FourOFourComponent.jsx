import { Link } from "react-router-dom";

const FourOFourComponent = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
            <h1 className="text-6xl font-bold text-red-600">404</h1>
            <p className="mt-4 text-xl text-gray-700">
                Oops! Page not found.
            </p>
            <p className="mt-2 text-gray-600">
                Return to our <Link to='/' className="text-blue-500 hover:underline">home page</Link>.
            </p>
            <img
                src="https://via.placeholder.com/400x300.png?text=Lost+in+Space"
                alt="404 illustration"
                className="mt-8 w-80 h-auto"
            />
        </div>
    );
}

export default FourOFourComponent;
