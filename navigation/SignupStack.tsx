import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import SignUpTerms from "../screens/SignUp/SignUpTerms";
import SignUpName from "../screens/SignUp/SignUpName";
import SignUpEmail from "../screens/SignUp/SignUpEmail";
import SignUpPassword from "../screens/SignUp/SignUpPassword";
import SignUpSex from "../screens/SignUp/SignUpSex";
import SignUpBirth from "../screens/SignUp/SignUpBirth";
import SignUpPhone from "../screens/SignUp/SignUpPhone";
import SignUpChurch from "../screens/SignUp/SignUpChurch";
import SignUpConfirm from "../screens/SignUp/SignUpConfirm";
import SignUpSuccess from "../screens/SignUp/SignUpSuccess";

const NativeStack = createNativeStackNavigator();

const SignUpStack = ({ navigation: { navigate, goBack }, route: { params } }) => {
  return (
    <NativeStack.Navigator
      screenOptions={{
        presentation: "card",
        contentStyle: { backgroundColor: "white" },
        headerTitleAlign: "center",
        headerTitleStyle: { fontFamily: "NotoSansKR-Medium", fontSize: 16 },
        headerShadowVisible: false,
      }}
    >
      <NativeStack.Screen
        name="SignUpTerms"
        component={SignUpTerms}
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
        name="SignUpName"
        component={SignUpName}
        options={{
          title: "회원가입",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("SignUpStack", { screen: "SignUpTerms" })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen name="SignUpEmail" component={SignUpEmail} options={{ title: "회원가입" }} />
      <NativeStack.Screen name="SignUpPassword" component={SignUpPassword} options={{ title: "회원가입" }} />
      <NativeStack.Screen name="SignUpSex" component={SignUpSex} options={{ title: "회원가입" }} />
      <NativeStack.Screen name="SignUpBirth" component={SignUpBirth} options={{ title: "회원가입" }} />
      <NativeStack.Screen name="SignUpPhone" component={SignUpPhone} options={{ title: "회원가입" }} />
      <NativeStack.Screen name="SignUpChurch" component={SignUpChurch} options={{ title: "회원가입" }} />
      <NativeStack.Screen name="SignUpConfirm" component={SignUpConfirm} options={{ title: "회원가입" }} />
      <NativeStack.Screen name="SignUpSuccess" component={SignUpSuccess} options={{ headerShown: false }} />
    </NativeStack.Navigator>
  );
};

export default SignUpStack;
