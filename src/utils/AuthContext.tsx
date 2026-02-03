import React, { createContext, useContext, useState, useEffect } from "react";
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    type User as FirebaseUser
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

interface User {
    uid: string;
    email: string | null;
    displayName?: string | null;
    photoURL?: string | null;
}

interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, displayName?: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
    user: null, 
    loading: true,
    signIn: async () => {},
    signUp: async () => {},
    logout: async () => {}
});

export const useAuth = () => useContext(AuthContext);

// Helper function to create/update user profile in Firestore
const createUserProfile = async (firebaseUser: FirebaseUser, additionalData?: { displayName?: string }) => {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
        const userData: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: additionalData?.displayName || firebaseUser.displayName || null,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        await setDoc(userRef, userData);
    }
};

export const AuthProvider = ({ children }: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen for Firebase auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userData: User = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL
                };
                setUser(userData);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Sign in error:", error);
            throw error;
        }
    };

    const signUp = async (email: string, password: string, displayName?: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Update display name if provided
            if (displayName) {
                await updateProfile(userCredential.user, { displayName });
            }
            
            // Create user profile in Firestore
            await createUserProfile(userCredential.user, { displayName });
        } catch (error) {
            console.error("Sign up error:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout error:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, logout }}>
            {children}
        </AuthContext.Provider>
    );
}