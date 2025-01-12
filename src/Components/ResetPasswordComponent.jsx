import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPasswordComponent = () => {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false); 
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
    const navigate = useNavigate();

    const token = searchParams.get('token');

    const backEndUrl = import.meta.env.VITE_REACT_APP_BACKEND_API;

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                `${backEndUrl}/reset-password`,
                { token, newPassword: password },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                setMessage('Your password has been reset successfully.');
                setTimeout(() => navigate('/login-signup'), 3000);
            }
        } catch (err) {
            console.error('Error:', err);
            setError(
                err.response?.data?.error ||
                'An error occurred. Please try again later.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100'>
            <div className='w-full max-w-md bg-white rounded-lg shadow-md p-6'>
                <h3 className='text-2xl font-semibold text-gray-700 text-center mb-6'>
                    Reset Password
                </h3>
                {message && (
                    <p className='text-green-600 text-center mb-4 font-medium'>{message}</p>
                )}
                {error && (
                    <p className='text-red-600 text-center mb-4 font-medium'>{error}</p>
                )}
                <form onSubmit={handleSubmit}>
                    <div className='mb-4 relative'>
                        <label
                            htmlFor='password'
                            className='block text-sm font-medium text-gray-700 mb-2'
                        >
                            New Password
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'} 
                            id='password'
                            name='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50'
                            placeholder='Enter your new password'
                        />
                        <button
                            type='button'
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute top-2 right-2 text-gray-500 hover:text-blue-500 focus:outline-none'
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                    <div className='mb-4 relative'>
                        <label
                            htmlFor='confirmPassword'
                            className='block text-sm font-medium text-gray-700 mb-2'
                        >
                            Confirm Password
                        </label>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'} 
                            id='confirmPassword'
                            name='confirmPassword'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50'
                            placeholder='Confirm your new password'
                        />
                        <button
                            type='button'
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className='absolute top-2 right-2 text-gray-500 hover:text-blue-500 focus:outline-none'
                        >
                            {showConfirmPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                    <button
                        type='submit'
                        className={`w-full ${
                            isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                        } text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordComponent;
