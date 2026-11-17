import { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";
import { account } from "./appwrite";

type AuthContextType = {
    user: Models.User<Models.Preferences> | null;
    loading: boolean;
    singUp: (email: string, password: string) => Promise<string | null>;
    singIn: (email: string, password: string) => Promise<string | null>;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({children}: {children: React.ReactNode}){
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [loading, setLoading] = useState(true);

    // Check existing session on app start
    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try{
            const currentUser = await account.get();
            setUser(currentUser);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    // Signup
    const singUp = async (email: string, password: string) => {
        try{
            await account.create(ID.unique(), email, password)
            await singIn(email, password);
            return null
        }catch(error){
            if(error instanceof Error) return error.message;
            return "Signup failed";
           
        }
    };

    // Signin
    const singIn = async (email: string, password: string) => {
        try{
            await account.createEmailPasswordSession(email, password);
            const currentUser = await account.get();
            setUser(currentUser);
            return null
        }catch(error){
            if(error instanceof Error) return error.message;
                return "Signin failed";
        }
    };

    // Signout
    const signOut = async () => {
        try {
            await account.deleteSession("current");
        } finally {
            setUser(null);
        }
    };

    // manual refresh
    const refreshUser = async () => {
        await checkUser();
    };

    return (
        <AuthContext.Provider value={{user, loading, singUp, singIn, signOut, refreshUser}}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be inside of the AuthProvider")
    }                   

    return context;
}