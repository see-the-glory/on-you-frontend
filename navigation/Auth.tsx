import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginStack from "./LoginStack";
import Main from "../screens/Auth/Main";
import SignUpStack from "./SignupStack";

const NativeStack = createNativeStackNavigator();

const Auth = () => {
  return (
    <NativeStack.Navigator initialRouteName="Main" screenOptions={{ presentation: "card", contentStyle: { backgroundColor: "white" }, headerShown: false }}>
      <NativeStack.Screen name="Main" component={Main} />
      <NativeStack.Screen name="LoginStack" component={LoginStack} />
      <NativeStack.Screen name="SignUpStack" component={SignUpStack} />
    </NativeStack.Navigator>
  );
};

export default Auth;
