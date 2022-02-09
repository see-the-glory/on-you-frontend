import React, { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './navigation/Tabs';
import { Text } from 'react-native';
import LoginStack from './navigation/LoginStack';

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
    <NavigationContainer>
      {isLoggedIn ? <Tabs /> : <LoginStack />}
    </NavigationContainer>
  );
}
