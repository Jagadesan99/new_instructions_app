import '../global.css';

import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { useContactsStore } from '@/store/contactsStore';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const customDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#09090b',
    card: '#18181b',
    text: '#fafafa',
    border: '#27272a',
    primary: '#8b5cf6',
  },
};

function AuthGate() {
  const { session, isLoading: authLoading } = useAuth();
  const loadData = useContactsStore((state) => state.loadData);
  const clearData = useContactsStore((state) => state.clearData);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    const inAuthGroup = segments[0] === 'login';

    if (!session && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/login');
    } else if (session && inAuthGroup) {
      // Redirect to main app if already authenticated
      router.replace('/');
    }
  }, [session, authLoading, segments]);

  // Load data when session is available
  useEffect(() => {
    if (session?.user) {
      loadData(session.user.id);
    } else {
      clearData();
    }
  }, [session?.user?.id]);

  if (authLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="contact/[id]"
        options={{
          presentation: 'card',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="share/[id]"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider value={customDarkTheme}>
        <AuthGate />
        <StatusBar style="light" />
      </ThemeProvider>
    </AuthProvider>
  );
}
