import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login/Login";
import FindLoginInfo from "../screens/Login/FindLoginInfo";
import { TouchableOpacity, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import FindEmail from "../screens/Login/FindEmail";
import FindPassword from "../screens/Login/FindPassword";
import FindResult from "../screens/Login/FindResult";

const NativeStack = createNativeStackNavigator();

const LoginStack = ({
  navigation: { navigate, popToTop },
  route: {
    params: { email },
  },
}) => {
  return (
    <NativeStack.Navigator
      screenOptions={{
        presentation: "card",
        contentStyle: { backgroundColor: "white" },
        headerTitleAlign: "center",
        headerTitleStyle: { fontFamily: "AppleSDGothicNeoB", fontSize: 16 },
        headerShadowVisible: false,
      }}
    >
      <NativeStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <NativeStack.Screen
        name="FindLoginInfo"
        component={FindLoginInfo}
        options={{
          title: "로그인 정보 찾기",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("LoginStack", { screen: "Login" })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="FindEmail"
        component={FindEmail}
        initialParams={{ email }}
        options={{
          title: "E-Mail 찾기",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("LoginStack", { screen: "FindLoginInfo" })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="FindResult"
        component={FindResult}
        initialParams={{ email }}
        options={{
          title: "E-Mail 찾기",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("LoginStack", { screen: "FindId" })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="FindPassword"
        component={FindPassword}
        options={{
          title: "비밀번호 찾기",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("LoginStack", { screen: "FindLoginInfo" })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </NativeStack.Navigator>
  );
};

export default LoginStack;
