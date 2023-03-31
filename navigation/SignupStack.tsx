import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import JoinStepOne from "../screens/SignUp/JoinStepOne";
import JoinStepTwo from "../screens/SignUp/JoinStepTwo";
import JoinStepThree from "../screens/SignUp/JoinStepThree";
import JoinStepFour from "../screens/SignUp/JoinStepFour";
import JoinStepFive from "../screens/SignUp/JoinStepFive";
import JoinStepSix from "../screens/SignUp/JoinStepSix";
import JoinStepSeven from "../screens/SignUp/JoinStepSeven";
import JoinStepEight from "../screens/SignUp/JoinStepEight";
import JoinConfirm from "../screens/SignUp/JoinConfirm";
import JoinStepSuccess from "../screens/SignUp/JoinStepSuccess";
import { TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";

const NativeStack = createNativeStackNavigator();

const SignUpStack = ({
  navigation: { navigate, goBack },
  route: {
    params: { name, email, password, sex, birth, phone, church, token },
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
            <TouchableOpacity onPress={() => navigate("SignUpStack", { screen: "JoinStepOne" })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen name="JoinStepThree" component={JoinStepThree} options={{ title: "회원가입" }} />
      <NativeStack.Screen name="JoinStepFour" component={JoinStepFour} options={{ title: "회원가입" }} />
      <NativeStack.Screen name="JoinStepFive" component={JoinStepFive} options={{ title: "회원가입" }} />
      <NativeStack.Screen name="JoinStepSix" component={JoinStepSix} options={{ title: "회원가입" }} />
      <NativeStack.Screen name="JoinStepSeven" component={JoinStepSeven} options={{ title: "회원가입" }} />
      <NativeStack.Screen name="JoinStepEight" component={JoinStepEight} options={{ title: "회원가입" }} />
      <NativeStack.Screen name="JoinConfirm" component={JoinConfirm} options={{ title: "회원가입" }} />
      <NativeStack.Screen name="JoinStepSuccess" component={JoinStepSuccess} options={{ title: "회원가입", headerLeft: () => <></> }} />
    </NativeStack.Navigator>
  );
};

export default SignUpStack;
