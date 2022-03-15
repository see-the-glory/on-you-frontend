import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StepOne from "../screens/ClubRegistration/StepOne";
import StepTwo from "../screens/ClubRegistration/StepTwo";
import StepThree from "../screens/ClubRegistration/StepThree";

const NativeStack = createNativeStackNavigator();

const ClubRegistrationStack = ({ navigation: { navigate } }) => (
  <NativeStack.Navigator
    screenOptions={{
      presentation: "card",
      contentStyle: { backgroundColor: "white" },
    }}
  >
    <NativeStack.Screen
      name="StepOne"
      component={StepOne}
      options={{
        title: "모임 개설",
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigate("Tabs", { screen: "Clubs" })}
          >
            <Ionicons name="chevron-back" size={20} color="black" />
          </TouchableOpacity>
        ),
      }}
    />
    <NativeStack.Screen
      name="StepTwo"
      component={StepTwo}
      options={{
        title: "모임 개설",
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigate("StepOne")}>
            <Ionicons name="chevron-back" size={20} color="black" />
          </TouchableOpacity>
        ),
      }}
    />
    <NativeStack.Screen
      name="StepThree"
      component={StepThree}
      options={{
        title: "모임 개설",
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigate("StepTwo")}>
            <Ionicons name="chevron-back" size={20} color="black" />
          </TouchableOpacity>
        ),
      }}
    />
  </NativeStack.Navigator>
);

export default ClubRegistrationStack;
