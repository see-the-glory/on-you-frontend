import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login/Login";
import FindLoginInfo from "../screens/Login/FindLoginInfo";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const NativeStack = createNativeStackNavigator();

const LoginStack = ({ navigation: { navigate } }) => {
  return (
    <NativeStack.Navigator screenOptions={{ presentation: "card", contentStyle: { backgroundColor: "white" } }}>
      <NativeStack.Screen
        name="Login"
        component={Login}
        options={{
          title: "로그인",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("AuthStack", { screen: "Main" })}>
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
    </NativeStack.Navigator>
  );
};

export default LoginStack;
