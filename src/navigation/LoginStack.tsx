import React from "react";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import Login from "@components/pages/Login/Login";
import FindLoginInfo from "@components/pages/Login/FindLoginInfo";
import { TouchableOpacity, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import FindEmail from "@components/pages/Login/FindEmail";
import FindPassword from "@components/pages/Login/FindPassword";
import FindResult from "@components/pages/Login/FindResult";
import { lightTheme } from "app/theme";
import { AuthStackParamList } from "./Auth";

export type LoginStackParamList = {
  Login: undefined;
  FindLoginInfo: undefined;
  FindEmail: undefined;
  FindResult: { findType: string; email?: string };
  FindPassword: undefined;
};

const NativeStack = createNativeStackNavigator<LoginStackParamList>();

const LoginStack: React.FC<NativeStackScreenProps<AuthStackParamList, "LoginStack">> = ({ navigation: { navigate, popToTop }, route }) => {
  return (
    <NativeStack.Navigator
      initialRouteName="Login"
      screenOptions={{
        presentation: "card",
        contentStyle: { backgroundColor: "white" },
        headerTitleAlign: "center",
        headerTitleStyle: { fontFamily: lightTheme.koreanFontB, fontSize: 16 },
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
