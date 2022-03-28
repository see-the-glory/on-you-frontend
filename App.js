import React, { useState } from "react";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import AppLoading from "expo-app-loading";
import { NavigationContainer } from "@react-navigation/native";
import Root from "./navigation/Root";
import LoginStack from "./navigation/LoginStack";

const loadFonts = (fonts) => fonts.map((font) => Font.loadAsync(font));

export default function App() {
  const [ready, setReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    <NavigationContainer>
      {isLoggedIn ? <Root /> : <LoginStack />}
    </NavigationContainer>
  );
}
