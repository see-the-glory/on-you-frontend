import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StepOne from "../screens/ClubCreation/StepOne";
import StepTwo from "../screens/ClubCreation/StepTwo";
import StepThree from "../screens/ClubCreation/StepThree";
import { useNavigationState } from "@react-navigation/native";

const NativeStack = createNativeStackNavigator();

const ClubCreationStack = ({ navigation: { navigate } }) => {
  return (
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
        options={({
          route: {
            params: { category },
          },
        }) => ({
          title: "모임 개설",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("StepTwo", { category })}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
        })}
      />
    </NativeStack.Navigator>
  );
};

export default ClubCreationStack;
