import React from "react";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import LoginStack from "./LoginStack";
import Main from "../components/pages/Auth/Main";
import SignUpStack from "./SignupStack";

export type AuthStackParamList = {
  Main: undefined;
  LoginStack: undefined;
  SignUpStack: undefined;
};

const NativeStack = createNativeStackNavigator<AuthStackParamList>();

const Auth: React.FC<NativeStackScreenProps<any, "Auth">> = () => {
  return (
    <NativeStack.Navigator initialRouteName="Main" screenOptions={{ presentation: "card", contentStyle: { backgroundColor: "white" }, headerShown: false }}>
      <NativeStack.Screen name="Main" component={Main} />
      <NativeStack.Screen name="LoginStack" component={LoginStack} />
      <NativeStack.Screen name="SignUpStack" component={SignUpStack} />
    </NativeStack.Navigator>
  );
};

export default Auth;
