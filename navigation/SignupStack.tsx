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
import JoinStepNine from "../screens/SignUp/JoinStepNine";
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
            <TouchableOpacity onPress={() => navigate("SignUpStack", { screen: "JoinStepEight" })}>
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
          headerLeft: () => <></>,
        }}
      />
    </NativeStack.Navigator>
  );
};

export default SignUpStack;
