import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginStack from "./LoginStack";
import KakaoAuth from "../screens/Login/KakaoAuth";
import Main from "../screens/Login/Main";

const NativeStack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <NativeStack.Navigator screenOptions={{ presentation: "card", contentStyle: { backgroundColor: "white" }, headerShown: false }}>
      <NativeStack.Screen name="Main" component={Main} />
      <NativeStack.Screen name="LoginStack" component={LoginStack} />
    </NativeStack.Navigator>
  );
};

export default AuthStack;
