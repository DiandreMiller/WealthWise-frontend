import PropTypes from 'prop-types';

const SignUpComponent = ({ formik, userError, togglePasswordVisibility, showPassword, toggleForm }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>
        {userError && <p className="text-red-500 mb-4">{userError}</p>}
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2 text-left">Username:</label>
            <input
              required
              type="text"
              name="username"
              onChange={formik.handleChange}
              value={formik.values.username}
              className="border border-gray-600 rounded p-3 w-full bg-gray-700 text-white"
              placeholder="Enter your username"
            />
            {formik.errors.username && <p className="text-red-500">{formik.errors.username}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2 text-left">Email:</label>
            <input
              required
              type="email"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              className="border border-gray-600 rounded p-3 w-full bg-gray-700 text-white"
              placeholder="Enter your email"
            />
            {formik.errors.email && <p className="text-red-500">{formik.errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2 text-left">Phone Number:</label>
            <input
              required
              type="text"
              name="phoneNumber"
              onChange={formik.handleChange}
              value={formik.values.phoneNumber}
              className="border border-gray-600 rounded p-3 w-full bg-gray-700 text-white"
              placeholder="Enter your phone number"
            />
            {formik.errors.phoneNumber && <p className="text-red-500">{formik.errors.phoneNumber}</p>}
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-300 mb-2 text-left">Password:</label>
            <input
              required
              type={showPassword ? 'text' : 'password'}
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              className="border border-gray-600 rounded p-3 w-full bg-gray-700 text-white"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
            {formik.errors.password && <p className="text-red-500">{formik.errors.password}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2 text-left">Date of Birth:</label>
            <input
              required
              type="date"
              name="dateOfBirth"
              onChange={formik.handleChange}
              value={formik.values.dateOfBirth}
              className="border border-gray-600 rounded p-3 w-full bg-gray-700 text-white"
            />
            {formik.errors.dateOfBirth && <p className="text-red-500">{formik.errors.dateOfBirth}</p>}
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <button
              onClick={toggleForm} // Toggle to login form
              className="text-blue-400 hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

SignUpComponent.propTypes = {
  formik: PropTypes.shape({
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    values: PropTypes.shape({
      username: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phoneNumber: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
      dateOfBirth: PropTypes.string.isRequired
    }).isRequired,
    errors: PropTypes.shape({
      username: PropTypes.string,
      email: PropTypes.string,
      phoneNumber: PropTypes.string,
      password: PropTypes.string,
      dateOfBirth: PropTypes.string
    })
  }).isRequired,
  userError: PropTypes.string,
  togglePasswordVisibility: PropTypes.func.isRequired,
  showPassword: PropTypes.bool.isRequired,
  toggleForm: PropTypes.func.isRequired
};

export default SignUpComponent;
