import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
    uid: string;
    email: string | null;
    displayName?: string | null;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({ 
    user: null, 
    loading: true,
    setUser: () => {} 
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            try {
                // Check localStorage for user
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    setUser(JSON.parse(userStr));
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}