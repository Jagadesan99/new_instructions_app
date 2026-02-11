import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Secure store adapter for Supabase auth token persistence
const ExpoSecureStoreAdapter = {
    getItem: (key: string) => {
        if (Platform.OS === 'web') {
            if (typeof window !== 'undefined') {
                return localStorage.getItem(key);
            }
            return null;
        }
        return SecureStore.getItemAsync(key);
    },
    setItem: (key: string, value: string) => {
        if (Platform.OS === 'web') {
            if (typeof window !== 'undefined') {
                localStorage.setItem(key, value);
            }
            return;
        }
        return SecureStore.setItemAsync(key, value);
    },
    removeItem: (key: string) => {
        if (Platform.OS === 'web') {
            if (typeof window !== 'undefined') {
                localStorage.removeItem(key);
            }
            return;
        }
        return SecureStore.deleteItemAsync(key);
    },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || supabaseUrl === 'your-supabase-url-here') {
    console.warn(
        '⚠️ Supabase URL not configured. Please update your .env file with your Supabase project URL and anon key.\n' +
        'Get these from: Supabase Dashboard → Settings → API'
    );
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key',
    {
        auth: {
            storage: ExpoSecureStoreAdapter,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    }
);
