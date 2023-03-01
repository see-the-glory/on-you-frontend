import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login/Login";
import FindLoginInfo from "../screens/Login/FindLoginInfo";
import { TouchableOpacity, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import FindId from "../screens/Login/FindId";
import FindPw from "../screens/Login/FindPw";
import FindIdResult from "../screens/Login/FindIdResult";
import FindPwResult from "../screens/Login/FindPwResult";

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
        headerTitleStyle: { fontFamily: "NotoSansKR-Medium", fontSize: 16 },
      }}
    >
      <NativeStack.Screen
        name="Login"
        component={Login}
        options={{
          title: "로그인",
          headerLeft: () => (
            <TouchableOpacity onPress={() => popToTop()}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
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
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="FindId"
        component={FindId}
        initialParams={{ email }}
        options={{
          title: "아이디 찾기",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("LoginStack", { screen: "FindLoginInfo" })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="FindIdResult"
        component={FindIdResult}
        initialParams={{ email }}
        options={{
          title: "아이디 찾기",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("LoginStack", { screen: "FindId" })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="FindPw"
        component={FindPw}
        options={{
          title: "비밀번호 찾기",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("LoginStack", { screen: "FindLoginInfo" })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="FindPwResult"
        component={FindPwResult}
        options={{
          title: "비밀번호 찾기",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("LoginStack", { screen: "FindPw" })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </NativeStack.Navigator>
  );
};

export default LoginStack;
