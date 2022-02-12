import React, {useState } from 'react';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './navigation/Tabs';
import LoginStack from './navigation/LoginStack';
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const loadFonts = (fonts) => fonts.map((font) => Font.loadAsync(font));

export default function App() {
  const [ready, setReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const onFinish = () => setReady(true);
  const Stack = createNativeStackNavigator();

  const Navigator=()=>{
    return(
        <Stack.Navigator>
          <Stack.Screen name={Tabs} component={Tabs} options={{headerShown: false}}/>
        </Stack.Navigator>
    )
  }

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
      <NavigationContainer screenOptions={{headerShown: false}}>
        {isLoggedIn ? <Tabs screenOptions={{headerShown: false}}/> : <LoginStack />}
      </NavigationContainer>
  );
}
