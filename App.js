import React, {useState } from 'react';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './navigation/Tabs';
import LoginStack from './navigation/LoginStack';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Club from './screens/Club'
import Account from './screens/headerTab/Account'
import Group from './screens/headerTab/Group'


const loadFonts = (fonts) => fonts.map((font) => Font.loadAsync(font));

export default function App() {
  const [ready, setReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const onFinish = () => setReady(true);
  const Stack = createNativeStackNavigator();

  const Navigator=()=>{
    return(
       <NavigationContainer>
         <Stack.Navigator>
           <Stack.Screen name="Account" component={Account} />
           <Stack.Screen name="Group" component={Group} />
         </Stack.Navigator>
       </NavigationContainer>
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
          {/*<Stack.Navigator>
              <Stack.Screen name="Account" component={Account} />
              <Stack.Screen name="Group" component={Group} />
              <Tabs/>
          </Stack.Navigator>*/}
        {isLoggedIn ? <Tabs screenOptions={{headerShown: false}}/>  : <LoginStack />}
      </NavigationContainer>
  );
}
