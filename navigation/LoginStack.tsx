import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import KakaoAuth from "../screens/Login/KakaoAuth";
// import Join from "../screens/Login/Join";

const NativeStack = createNativeStackNavigator();

const LoginStack = () => (
  <NativeStack.Navigator screenOptions={{ headerShown: false }}>
    <NativeStack.Screen name="KakaoAuth" component={KakaoAuth} />
  </NativeStack.Navigator>
);

export default LoginStack;
