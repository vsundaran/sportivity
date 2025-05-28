// theme.ts
import { MD3DarkTheme, MD3LightTheme, MD3Theme } from "react-native-paper";

export const lightTheme: MD3Theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: "#2296f3",
        secondary: "#03dac6",
        background: "#ffffff",
        surface: "#ffffff",
        onPrimary: "#ffffff",
        onSecondary: "#000000",
    },
};

export const darkTheme: MD3Theme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: "#2296f3",
        secondary: "#03dac6",
        background: "#121212",
        surface: "#121212",
        onPrimary: "#000000",
        onSecondary: "#ffffff",
    },
};
