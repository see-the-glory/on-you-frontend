import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import KakaoAuth from "../screens/Login/KakaoAuth";

const NativeStack = createNativeStackNavigator();

const LoginStack = () => (
  <NativeStack.Navigator screenOptions={{ headerShown: false }}>
    <NativeStack.Screen name="kakaoAuth" component={KakaoAuth} />
  </NativeStack.Navigator>
);

export default LoginStack;
