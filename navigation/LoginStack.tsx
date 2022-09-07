import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login/Login";
import JoinStepOne from "../screens/Login/JoinStepOne";
import JoinStepTwo from "../screens/Login/JoinStepTwo";
import JoinStepThree from "../screens/Login/JoinStepThree";
import JoinStepFour from "../screens/Login/JoinStepFour";
import JoinStepFive from "../screens/Login/JoinStepFive";
import JoinStepSix from "../screens/Login/JoinStepSix";
import JoinStepSeven from "../screens/Login/JoinStepSeven";
import JoinStepEight from "../screens/Login/JoinStepEight";
import JoinStepNine from "../screens/Login/JoinStepNine";
import FindLoginInfo from "../screens/Login/FindLoginInfo";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const NativeStack = createNativeStackNavigator();

const LoginStack = ({ navigation: { navigate, goBack } }) => {
  return (
    <NativeStack.Navigator screenOptions={{ presentation: "card", contentStyle: { backgroundColor: "white" } }}>
      <NativeStack.Screen
        name="Login"
        component={Login}
        options={{
          title: "로그인",
          headerLeft: () => (
            <TouchableOpacity onPress={() => goBack()}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="FindLoginInfo"
        component={FindLoginInfo}
        options={{
          title: "로그인 정보 찾기",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("LoginStack", { screen: "Login" })}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="JoinStepOne"
        component={JoinStepOne}
        options={{
          title: "회원가입",
          headerLeft: () => (
            <TouchableOpacity onPress={() => goBack()}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="JoinStepTwo"
        component={JoinStepTwo}
        options={{
          title: "회원가입",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("LoginStack", { screen: "JoinStepOne" })}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="JoinStepThree"
        component={JoinStepThree}
        options={{
          title: "회원가입",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("LoginStack", { screen: "JoinStepTwo" })}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="JoinStepFour"
        component={JoinStepFour}
        options={{
          title: "회원가입",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("LoginStack", { screen: "JoinStepThree" })}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="JoinStepFive"
        component={JoinStepFive}
        options={{
          title: "회원가입",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("LoginStack", { screen: "JoinStepFour" })}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="JoinStepSix"
        component={JoinStepSix}
        options={{
          title: "회원가입",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("LoginStack", { screen: "JoinStepFive" })}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="JoinStepSeven"
        component={JoinStepSeven}
        options={{
          title: "회원가입",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("LoginStack", { screen: "JoinStepSix" })}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="JoinStepEight"
        component={JoinStepEight}
        options={{
          title: "회원가입",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("LoginStack", { screen: "JoinStepSeven" })}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="JoinStepNine"
        component={JoinStepNine}
        options={{
          title: "회원가입",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("LoginStack", { screen: "JoinStepEight" })}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </NativeStack.Navigator>
  );
};

export default LoginStack;
