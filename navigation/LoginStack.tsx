import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import KakaoAuth from "../screens/Login/KakaoAuth";
import Main from "../screens/Login/Main";
import Login from "../screens/Login/Login";

const NativeStack = createNativeStackNavigator();

const LoginStack = (/* { navigation: { navigate } } */) => {
  return (
    <NativeStack.Navigator screenOptions={{ presentation: "card", contentStyle: { backgroundColor: "white" }, headerShown: false }}>
      <NativeStack.Screen name="KakaoAuth" component={KakaoAuth} />
      {/* <NativeStack.Screen
        name="Login"
        component={Login}
        options={{
          title: "로그인",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("Tabs", { screen: "Home" })}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      /> */}
    </NativeStack.Navigator>
  );
};

export default LoginStack;
