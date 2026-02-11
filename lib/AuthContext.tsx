import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    isLoading: boolean;
    signInWithOtp: (email: string) => Promise<{ error: Error | null }>;
    verifyOtp: (email: string, token: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsLoading(false);
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                setIsLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const signInWithOtp = async (email: string) => {
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: true,
                },
            });
            return { error: error ? new Error(error.message) : null };
        } catch (err) {
            return { error: err as Error };
        }
    };

    const verifyOtp = async (email: string, token: string) => {
        try {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'email',
            });
            return { error: error ? new Error(error.message) : null };
        } catch (err) {
            return { error: err as Error };
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };

    return (
        <AuthContext.Provider
            value={{
                session,
                user: session?.user ?? null,
                isLoading,
                signInWithOtp,
                verifyOtp,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
