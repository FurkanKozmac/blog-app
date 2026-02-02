// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // LocalStorage'dan rolü de alalım
    const [user, setUser] = useState({
        isLoggedIn: !!localStorage.getItem('accessToken'),
        role: localStorage.getItem('userRole') // ROLE_ADMIN veya ROLE_USER
    });

    const login = (accessToken, refreshToken, role) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userRole', role); // Rolü kaydet
        setUser({ isLoggedIn: true, role: role });
    };

    const logout = () => {
        localStorage.clear();
        setUser({ isLoggedIn: false, role: null });
    };

    return (
        <AuthContext.Provider value={{ ...user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);