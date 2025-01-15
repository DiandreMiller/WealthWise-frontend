import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DOMPurify from 'dompurify';

const ForgotPasswordComponent = () => {

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const backEndUrl = import.meta.env.VITE_REACT_APP_BACKEND_API;

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setError("");
        setIsSubmitting(true);

        try {
            const response = await axios.post(
                `${backEndUrl}/password-reset-request`,
                { email },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                setMessage("If the email exists, a password reset link has been sent.");
            }
        } catch (err) {
            console.error("Error:", err);
            setError(
                err.response?.data?.error ||
                "An error occurred. Please check your connection and try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };
    

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <h3 className="text-2xl font-semibold text-gray-700 text-center mb-6">
                    Forgot Password
                </h3>
                <p className="text-gray-600 text-center mb-4">
                    Enter your email address below, and we’ll send you a link to reset your password.
                </p>
                {message && (
                    <p className="text-green-600 text-center mb-4 font-medium">{message}</p>
                )}
                {error && (
                    <p className="text-red-600 text-center mb-4 font-medium">{error}</p>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(event) => setEmail(DOMPurify.sanitize(event.target.value))}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50"
                            placeholder="Enter your email"
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full ${
                            isSubmitting ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                        } text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
                <p className="text-sm text-gray-600 text-center mt-4">
                    Remember your password?{" "}
                    <Link to="/login-signup" className="text-blue-500 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordComponent;
