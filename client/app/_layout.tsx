

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
        {/* <View style={{ overflow: 'hidden', width: 200, height: 200 }}> */}
        <Image
          source={require('../assets/images/splash.png')}
          style={styles.image}
          resizeMode="contain"
        />
        {/* </View> */}
      </View>
    );
  }
  return <RootLayout />;
}


function RootLayout() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  const router = useRouter();
  const { user } = useAuth();

  return (
    // <SafeAreaView style={{ flex: 1 }} edges={['top']}>
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: '#ffffff',
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="activity-list"
          options={{
            ...getScreenOptions("Activity List"),
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.push('/settings')}>
                {user?.profileImage ? (
                  <Image
                    source={{ uri: user.profileImage }}
                    style={{
                      width: 42,
                      height: 42,
                      marginLeft: 10,
                      borderRadius: 100,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 46,
                      height: 46,
                      marginLeft: 10,
                      borderRadius: 100,
                      backgroundColor: '#bdbdbd',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{ color: '#fff', fontSize: 22 }}
                    >
                      {user?.firstName?.[0]?.toUpperCase() || ''}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen name="create-activity" options={getScreenOptions("New Activity")} />
        <Stack.Screen name="pic-sport" options={getScreenOptions("Pick Your Primary Sport")} />
        <Stack.Screen name="profile" options={getScreenOptions("Profile")} />
        <Stack.Screen name="skill-assessment" options={getScreenOptions("Skill Assessment Summary")} />
        <Stack.Screen name="invite-player" options={getScreenOptions("Invite players")} />
        <Stack.Screen name="settings" options={getScreenOptions("Settings")} />
      </Stack>
    </>
    // </SafeAreaView >
  );
}

const getScreenOptions = (title: string) => ({
  title,
  headerTitleAlign: 'center' as const,
  headerTintColor: '#000000',
  headerTitleStyle: {
    color: darkTheme.colors.primary,
  },
  headerStyle: {
    height: 60, // Set a specific height for the header
    backgroundColor: '#ffffff',
  },
  headerShadowVisible: false,
  // headerStatusBarHeight: 0,
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
  },
});
