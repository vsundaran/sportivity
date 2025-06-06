// Layout.tsx

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { store } from "@/redux/store";
import { darkTheme, lightTheme } from "@/theme";
import { useColorScheme } from 'react-native';

const queryClient = new QueryClient();
SplashScreen.preventAutoHideAsync();

export default function AppLayoutWrapper() {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <PaperProvider theme={lightTheme}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <Provider store={store}>
                <Layout />
              </Provider>
            </AuthProvider>
          </QueryClientProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
function Layout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (appIsReady && isAuthenticated) {
      router.navigate('/activity-list');
    }
  }, [appIsReady, isAuthenticated]);

  useEffect(() => {
    const prepare = async () => {
      if (!isLoading) {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    };
    prepare();
  }, [isLoading]);

  if (!appIsReady || isLoading) {
    return (
      <View style={styles.container}>
        <View style={{ overflow: 'hidden', borderRadius: 100, width: 200, height: 200 }}>
          <Image
            source={require('../assets/images/splash.png')}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </View>
    );
  }
  return <RootLayout />;
}


function RootLayout() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  const router = useRouter();
  const { user } = useAuth()


  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="activity-list" options={{
        ...getScreenOptions("Activity List"), headerLeft: () => (
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Image
              source={{ uri: user?.profileImage || "https://via.placeholder.com/32" }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                marginLeft: 10,
              }}
            />
          </TouchableOpacity>
        ),
      }} />
      <Stack.Screen name="create-activity" options={getScreenOptions("New Activity")} />
      <Stack.Screen name="pic-sport" options={getScreenOptions("Pick Your Primary Sport")} />
      <Stack.Screen name="profile" options={getScreenOptions("Profile")} />
      <Stack.Screen name="skill-assessment" options={getScreenOptions("Skill Assessment Summary")} />
    </Stack>
  );
}

const getScreenOptions = (title: string) => ({
  title,
  headerTitleAlign: 'center' as const,
  headerTintColor: '#000000',
  headerTitleStyle: {
    color: darkTheme.colors.primary,
  },
  headerShadowVisible: false,
});

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#15c5f6"
  },
  image: {
    flex: 1,
    maxWidth: '100%',
    maxHeight: '100%',
    width: '100%',
    height: 'auto',
    borderRadius: 100,
  },
});
