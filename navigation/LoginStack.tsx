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
import JoinConfirm from "../screens/Login/JoinConfirm";
import JoinStepSuccess from "../screens/Login/JoinStepSuccess";
import FindLoginInfo from "../screens/Login/FindLoginInfo";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FindId from "../screens/Login/FindId";
import FindPw from "../screens/Login/FindPw";
import FindIdResult from "../screens/Login/FindIdResult";
import FindPwResult from "../screens/Login/FindPwResult";

const NativeStack = createNativeStackNavigator();

const LoginStack = ({
  navigation: { navigate, goBack },
  route: {
    params: { userData, category, name, email, password, sex, birth, phone, church, token },
  },
}) => {
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
        name="FindId"
        component={FindId}
        initialParams={{ email }}
        options={{
          title: "아이디 찾기",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("LoginStack", { screen: "FindLoginInfo" })}>
              <Ionicons name="chevron-back" size={20} color="black" />
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
              <Ionicons name="chevron-back" size={20} color="black" />
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
              <Ionicons name="chevron-back" size={20} color="black" />
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
        initialParams={{ name }}
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
        initialParams={{ name, email }}
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
        name="JoinStepFive"
        component={JoinStepFive}
        initialParams={{ name, email, password }}
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
        name="JoinStepSix"
        component={JoinStepSix}
        initialParams={{ name, email, password, sex }}
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
        initialParams={{ name, email, password, sex, birth }}
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
        initialParams={{ name, email, password, sex, birth, phone }}
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
        initialParams={{ name, email, password, sex, birth, phone, church, userData, category }}
        options={{
          title: "회원가입",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("LoginStack", { screen: "JoinStepEight" })}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="JoinConfirm"
        component={JoinConfirm}
        initialParams={{ name, email, password, sex, birth, phone, church, userData, category, token }}
        options={{
          title: "회원가입",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("LoginStack", { screen: "JoinStepNine" })}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="JoinStepSuccess"
        component={JoinStepSuccess}
        initialParams={{ name, email, password, token }}
        options={{
          title: "회원가입",
          headerLeft: () => <TouchableOpacity onPress={() => navigate("LoginStack", { screen: "JoinConfirm" })}>{/* <Ionicons name="chevron-back" size={20} color="black" /> */}</TouchableOpacity>,
        }}
      />
    </NativeStack.Navigator>
  );
};

export default LoginStack;
