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
import { Entypo } from "@expo/vector-icons";
import FindId from "../screens/Login/FindId";
import FindPw from "../screens/Login/FindPw";
import FindIdResult from "../screens/Login/FindIdResult";
import FindPwResult from "../screens/Login/FindPwResult";

const NativeStack = createNativeStackNavigator();

const LoginStack = ({
  navigation: { navigate, goBack, popToTop },
  route: {
    params: { userData, category, name, email, password, sex, birth, phone, church, token },
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
      <NativeStack.Screen
        name="JoinStepOne"
        component={JoinStepOne}
        options={{
          title: "약관 동의",
          headerLeft: () => (
            <TouchableOpacity onPress={() => goBack()}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
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
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="JoinStepThree"
        component={JoinStepThree}
        initialParams={{ name }}
        options={{
          title: "회원가입",
        }}
      />
      <NativeStack.Screen
        name="JoinStepFour"
        component={JoinStepFour}
        initialParams={{ name, email }}
        options={{
          title: "회원가입",
        }}
      />
      <NativeStack.Screen
        name="JoinStepFive"
        component={JoinStepFive}
        initialParams={{ name, email, password }}
        options={{
          title: "회원가입",
        }}
      />
      <NativeStack.Screen
        name="JoinStepSix"
        component={JoinStepSix}
        initialParams={{ name, email, password, sex }}
        options={{
          title: "회원가입",
        }}
      />
      <NativeStack.Screen
        name="JoinStepSeven"
        component={JoinStepSeven}
        initialParams={{ name, email, password, sex, birth }}
        options={{
          title: "회원가입",
        }}
      />
      <NativeStack.Screen
        name="JoinStepEight"
        component={JoinStepEight}
        initialParams={{ name, email, password, sex, birth, phone }}
        options={{
          title: "회원가입",
        }}
      />
      <NativeStack.Screen
        name="JoinStepNine"
        component={JoinStepNine}
        initialParams={{ name, email, password, sex, birth, phone, church }}
        options={{
          title: "회원가입",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("LoginStack", { screen: "JoinStepEight" })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="JoinConfirm"
        component={JoinConfirm}
        initialParams={{ name, email, password, sex, birth, phone, church }}
        options={{
          title: "회원가입",
        }}
      />
      <NativeStack.Screen
        name="JoinStepSuccess"
        component={JoinStepSuccess}
        initialParams={{ name, email, password, token }}
        options={{
          title: "회원가입",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("LoginStack", { screen: "JoinConfirm" })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </NativeStack.Navigator>
  );
};

export default LoginStack;
