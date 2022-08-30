import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import KakaoAuth from "../screens/Login/KakaoAuth";
import Main from "../screens/Login/Main";
import Login from "../screens/Login/Login";
import FindLoginInfo from "../screens/Login/FindLoginInfo";
import FindId from "../screens/Login/FindId";
import FindPw from "../screens/Login/FindPw";
import JoinStepOne from "../screens/Login/JoinStepOne";
import JoinStepTwo from "../screens/Login/JoinStepTwo";
import JoinStepThree from "../screens/Login/JoinStepThree";
import JoinStepFour from "../screens/Login/JoinStepFour";
import JoinStepFive from "../screens/Login/JoinStepFive";
import JoinStepSix from "../screens/Login/JoinStepSix";
import JoinStepSeven from "../screens/Login/JoinStepSeven";
import JoinStepEight from "../screens/Login/JoinStepEight";
import JoinStepNine from "../screens/Login/JoinStepNine";

const NativeStack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <NativeStack.Navigator screenOptions={{ presentation: "card", contentStyle: { backgroundColor: "white" }, headerShown: false }}>
      <NativeStack.Screen name="KakaoAuth" component={JoinStepNine} />
    </NativeStack.Navigator>
  );
};

export default AuthStack;
