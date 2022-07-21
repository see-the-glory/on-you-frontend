import React, { useState } from "react";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import AppLoading from "expo-app-loading";
import { NavigationContainer } from "@react-navigation/native";
import Root from "./navigation/Root";
import LoginStack from "./navigation/LoginStack";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const loadFonts = (fonts) => fonts.map((font) => Font.loadAsync(font));

export default function App() {
  const [ready, setReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const onFinish = () => setReady(true);

  // PreLoading
  const startLoading = async () => {
    const fonts = loadFonts([Ionicons.font]);
    await Promise.all(fonts);
  };

  if (!ready) {
    return (
        <AppLoading
            startAsync={startLoading}
            onFinish={onFinish}
            onError={console.error}
        />
    );
  }

  return (
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          {isLoggedIn ? <Root /> : <LoginStack />}
        </NavigationContainer>
      </QueryClientProvider>
  );
}

