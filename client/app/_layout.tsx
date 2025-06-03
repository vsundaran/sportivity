import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';

import { AuthProvider } from "@/context/AuthContext";
import { store } from "@/redux/store";
import { darkTheme, lightTheme } from "@/theme";

// Initialize query client
const queryClient = new QueryClient();

// Prevent splash screen from auto hiding
SplashScreen.preventAutoHideAsync();

// Reusable screen options
const getScreenOptions = (title: string) => ({
  title,
  headerTitleAlign: 'center' as const,
  headerTintColor: '#000000', // Black color for back arrow
  headerTitleStyle: {
    color: darkTheme.colors.primary,
  },
  headerShadowVisible: false, // Remove header shadow
});

export default function Layout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        // Simulate resource loading
        await new Promise(resolve => setTimeout(resolve, 2000));
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  if (!appIsReady) {
    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/images/splash-icon.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    );
  }

  return <RootLayout />;
}

function RootLayout() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <Provider store={store}>
                <Stack>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="activityList"
                    options={getScreenOptions("Activity List")}
                  />
                  <Stack.Screen
                    name="create-activity"
                    options={getScreenOptions("New Activity")}
                  />
                  <Stack.Screen
                    name="pic-sport"
                    options={{
                      ...getScreenOptions("Pick Your Primary Sport")
                    }}
                  />
                  <Stack.Screen
                    name="profile"
                    options={{ ...getScreenOptions("Profile") }}
                  />
                  <Stack.Screen
                    name="skill-assessment"
                    options={{ ...getScreenOptions("Skill Assessment Summary") }}
                  />
                </Stack>
                <Toast />
              </Provider>
            </AuthProvider>
          </QueryClientProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});