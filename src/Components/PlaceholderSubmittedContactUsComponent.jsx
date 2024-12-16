const PlaceHolderSubmittedContactUsComponent = () => {
    return (
        <div className="bg-gray-100 dark:bg-gray-800 min-h-screen flex items-center justify-center px-4 sm:px-8">
            <div className="max-w-2xl w-full bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 sm:p-10 text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    Thank You For Reaching Out
                </h1>
                <p className="text-gray-700 dark:text-gray-400 text-lg">
                    We have received your message and will respond as soon as possible.
                </p>
                <p className="text-gray-700 dark:text-gray-400 text-lg mt-2">
                    If your inquiry is urgent, feel free to contact us directly.
                </p>

                <div className="mt-6">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800"
                    >
                        Go Back to Homepage
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlaceHolderSubmittedContactUsComponent;
