import React from "react";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import ClubCreationStepOne from "../components/pages/ClubCreation/ClubCreationStepOne";
import ClubCreationStepTwo from "../components/pages/ClubCreation/ClubCreationStepTwo";
import ClubCreationStepThree from "../components/pages/ClubCreation/ClubCreationStepThree";
import ClubCreationSuccess from "../components/pages/ClubCreation/ClubCreationSuccess";
import ClubCreationFail from "../components/pages/ClubCreation/ClubCreationFail";
import { lightTheme } from "../theme";
import { Club } from "../api";
import { RootStackParamList } from "./Root";

export type ClubCreationStackParamList = {
  ClubCreationStepOne: undefined;
  ClubCreationStepTwo: { category1: number; category2: number };
  ClubCreationStepThree: {
    category1: number;
    category2: number;
    clubName: string;
    maxNumber: number;
    isApproveRequired: string;
    phoneNumber: string;
    organizationName: string;
    imageURI: string | null;
  };
  ClubCreationSuccess: { clubData?: Club };
  ClubCreationFail: undefined;
};

const NativeStack = createNativeStackNavigator<ClubCreationStackParamList>();

const ClubCreationStack: React.FC<NativeStackScreenProps<RootStackParamList, "ClubCreationStack">> = ({ navigation: { navigate }, route: { params } }) => {
  return (
    <NativeStack.Navigator
      screenOptions={{
        presentation: "card",
        contentStyle: { backgroundColor: "white" },
        headerTitleAlign: "center",
        headerTitleStyle: { fontFamily: lightTheme.koreanFontB, fontSize: 16 },
        headerShadowVisible: false,
      }}
    >
      <NativeStack.Screen name="ClubCreationStepOne" component={ClubCreationStepOne} options={{ title: "모임 개설" }} />
      <NativeStack.Screen name="ClubCreationStepTwo" component={ClubCreationStepTwo} options={{ title: "모임 개설" }} />
      <NativeStack.Screen name="ClubCreationStepThree" component={ClubCreationStepThree} options={{ title: "모임 개설" }} />
      <NativeStack.Screen name="ClubCreationSuccess" component={ClubCreationSuccess} options={{ headerShown: false, gestureEnabled: false }} />
      <NativeStack.Screen name="ClubCreationFail" component={ClubCreationFail} options={{ headerShown: false }} />
    </NativeStack.Navigator>
  );
};

export default ClubCreationStack;
