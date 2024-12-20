import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import Cookies from 'js-cookie'

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component
const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [canRegisterPasskey, setCanRegisterPasskey] = useState(false);
    const [isLogin, setIsLogin] = useState(true); 
    const [loading, setLoading] = useState(true);

    //Check for tokens in cookies on initial load

    useEffect(() => {

        const storedToken = Cookies.get('token');

        if(storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true);
        }

        setLoading(false);

    },[])

    // Login function
    const login = (token, expiresIn) => {
        setIsAuthenticated(true);
        setToken(token);
        setCanRegisterPasskey(true);

        // Store token in cookies with expiration
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        Cookies.set("token", token, { expires: expirationDate, secure: true, sameSite: "strict" });
    };

    // Logout function
    const logout = () => {
        setIsAuthenticated(false);
        setToken(null);
        setCanRegisterPasskey(false);
        setIsLogin(true); 
        Cookies.remove("token");
    };

    const reset = () => {
        setIsAuthenticated(false);
        setToken(null);
        setCanRegisterPasskey(false);
        setIsLogin(true); 
        Cookies.remove("token");
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
                loading,
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
