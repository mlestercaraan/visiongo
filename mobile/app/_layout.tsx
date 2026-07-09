import { Stack, router, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-native-reanimated';

import { useAppStore } from '../store/useAppStore';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

function AuthGuard() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const segments = useSegments();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments]);

  return null;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="device/index" options={{ headerShown: false }} />
        <Stack.Screen name="plans/index" options={{ headerShown: false }} />
        <Stack.Screen name="referral/index" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="ticket/[ticketId]" options={{ headerShown: false }} />
        <Stack.Screen name="ticket/new" options={{ headerShown: false }} />
        <Stack.Screen name="pay/[billId]" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
