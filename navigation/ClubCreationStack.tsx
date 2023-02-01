import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import ClubCreationStepOne from "../screens/ClubCreation/ClubCreationStepOne";
import ClubCreationStepTwo from "../screens/ClubCreation/ClubCreationStepTwo";
import ClubCreationStepThree from "../screens/ClubCreation/ClubCreationStepThree";
import { ClubCreationStackProps, ClubStackParamList } from "../Types/Club";
import ClubCreationSuccess from "../screens/ClubCreation/ClubCreationSuccess";
import ClubCreationFail from "../screens/ClubCreation/ClubCreationFail";

const NativeStack = createNativeStackNavigator<ClubStackParamList>();

const ClubCreationStack: React.FC<ClubCreationStackProps> = ({ navigation: { navigate }, route: { params: category } }) => {
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
        name="ClubCreationStepOne"
        component={ClubCreationStepOne}
        initialParams={category}
        options={{
          title: "모임 개설",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("Tabs", { screen: "Clubs" })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="ClubCreationStepTwo"
        component={ClubCreationStepTwo}
        options={{
          title: "모임 개설",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("ClubCreationStepOne", { category })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="ClubCreationStepThree"
        component={ClubCreationStepThree}
        options={({
          route: {
            params: { category1, category2 },
          },
        }) => ({
          title: "모임 개설",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("ClubCreationStepTwo", { category1, category2 })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        })}
      />

      <NativeStack.Screen
        name="ClubCreationSuccess"
        component={ClubCreationSuccess}
        options={({
          route: {
            params: { clubId },
          },
        }) => ({
          headerShown: false,
        })}
      />

      <NativeStack.Screen
        name="ClubCreationFail"
        component={ClubCreationFail}
        options={({}) => ({
          headerShown: false,
        })}
      />
    </NativeStack.Navigator>
  );
};

export default ClubCreationStack;
