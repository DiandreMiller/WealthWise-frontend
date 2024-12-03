import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component
const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [canRegisterPasskey, setCanRegisterPasskey] = useState(false);
    const [isLogin, setIsLogin] = useState(true); // Added for login/signup state

    // Login function
    const login = (token) => {
        setIsAuthenticated(true);
        setToken(token);
        setCanRegisterPasskey(true);
    };

    // Logout function
    const logout = () => {
        setIsAuthenticated(false);
        setToken(null);
        setCanRegisterPasskey(false);
        setIsLogin(true); 
    };

    const reset = () => {
        setIsAuthenticated(false);
        setToken(null);
        setCanRegisterPasskey(false);
        setIsLogin(true); 
    };

    // Toggle between login and signup
    const toggleAuthState = () => {
        setIsLogin((prevState) => !prevState);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                token,
                login,
                logout,
                reset,
                canRegisterPasskey,
                isLogin,  
                toggleAuthState,  
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Prop validation
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// Hook to use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

export { AuthProvider };
