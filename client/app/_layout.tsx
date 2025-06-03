import { AuthProvider } from "@/context/AuthContext";
import { store } from "@/redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";

import { darkTheme, lightTheme } from "@/theme";
import { Provider as PaperProvider } from 'react-native-paper';

import { useColorScheme } from 'react-native';

const queryClient = new QueryClient();

export default function RootLayout() {
  const scheme = useColorScheme();
  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <PaperProvider theme={scheme === 'dark' ? darkTheme : lightTheme}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <Provider store={store}>
                <Stack>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen name="activityList" />
                  <Stack.Screen name="createActivity" />
                  <Stack.Screen name="pic-sport" />
                  <Stack.Screen
                    name="profile"
                    options={{
                      title: "Profile",
                      headerTitleAlign: 'center',
                      headerTintColor: darkTheme.colors.primary, // Use primary color for header text
                      headerTitleStyle: {
                        color: darkTheme.colors.primary,
                      }
                    }}
                  />
                  <Stack.Screen name="skill-assessment" />
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
});
