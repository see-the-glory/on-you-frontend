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

const ClubCreationStack: React.FC<ClubCreationStackProps> = ({ navigation: { navigate }, route: { params } }) => {
  return (
    <NativeStack.Navigator
      screenOptions={{
        presentation: "card",
        contentStyle: { backgroundColor: "white" },
        headerTitleAlign: "center",
        headerTitleStyle: { fontFamily: "AppleSDGothicNeoB", fontSize: 16 },
        headerShadowVisible: false,
      }}
    >
      <NativeStack.Screen name="ClubCreationStepOne" component={ClubCreationStepOne} options={{ title: "모임 개설" }} />
      <NativeStack.Screen name="ClubCreationStepTwo" component={ClubCreationStepTwo} options={{ title: "모임 개설" }} />
      <NativeStack.Screen name="ClubCreationStepThree" component={ClubCreationStepThree} options={{ title: "모임 개설" }} />
      <NativeStack.Screen name="ClubCreationSuccess" component={ClubCreationSuccess} options={{ headerShown: false }} />
      <NativeStack.Screen name="ClubCreationFail" component={ClubCreationFail} options={{ headerShown: false }} />
    </NativeStack.Navigator>
  );
};

export default ClubCreationStack;
