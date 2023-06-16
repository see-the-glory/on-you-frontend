import React from "react";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import SignUpTerms from "../components/pages/SignUp/SignUpTerms";
import SignUpName from "../components/pages/SignUp/SignUpName";
import SignUpEmail from "../components/pages/SignUp/SignUpEmail";
import SignUpPassword from "../components/pages/SignUp/SignUpPassword";
import SignUpSex from "../components/pages/SignUp/SignUpSex";
import SignUpBirth from "../components/pages/SignUp/SignUpBirth";
import SignUpPhone from "../components/pages/SignUp/SignUpPhone";
import SignUpConfirm from "../components/pages/SignUp/SignUpConfirm";
import SignUpSuccess from "../components/pages/SignUp/SignUpSuccess";
import { lightTheme } from "../theme";
import SignUpOrganization from "../components/pages/SignUp/SignUpOrganization";
import { AuthStackParamList } from "./Auth";

export type SignUpStackParamList = {
  SignUpTerms: undefined;
  SignUpName: undefined;
  SignUpEmail: { name: string };
  SignUpPassword: { name: string; email: string };
  SignUpSex: { name: string; email: string; password: string };
  SignUpBirth: { name: string; email: string; password: string; sex: string };
  SignUpPhone: { name: string; email: string; password: string; sex: string; birth?: string };
  SignUpOrganization: { name: string; email: string; password: string; sex: string; birth?: string; phone?: string };
  SignUpConfirm: { name: string; email: string; password: string; sex: string; birth?: string; phone?: string; organization: string };
  SignUpSuccess: { email: string; password: string };
};

const NativeStack = createNativeStackNavigator<SignUpStackParamList>();

const SignUpStack: React.FC<NativeStackScreenProps<AuthStackParamList, "SignUpStack">> = ({ navigation: { navigate, goBack }, route }) => {
  return (
    <NativeStack.Navigator
      initialRouteName="SignUpTerms"
      screenOptions={{
        presentation: "card",
        contentStyle: { backgroundColor: "white" },
        headerTitleAlign: "center",
        headerTitleStyle: { fontFamily: lightTheme.koreanFontB, fontSize: 16 },
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
      <NativeStack.Screen name="SignUpOrganization" component={SignUpOrganization} options={{ title: "회원가입" }} />
      <NativeStack.Screen name="SignUpConfirm" component={SignUpConfirm} options={{ title: "회원가입" }} />
      <NativeStack.Screen name="SignUpSuccess" component={SignUpSuccess} options={{ headerShown: false }} />
    </NativeStack.Navigator>
  );
};

export default SignUpStack;
