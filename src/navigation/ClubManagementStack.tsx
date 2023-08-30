import React from "react";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import ClubEditBasics from "@components/pages/ClubManagement/ClubEditBasics";
import ClubManagementMain from "@components/pages/ClubManagement/ClubManagementMain";
import ClubEditIntroduction from "@components/pages/ClubManagement/ClubEditIntroduction";
import ClubEditMembers from "@components/pages/ClubManagement/ClubEditMembers";
import ClubDelete from "@components/pages/ClubManagement/ClubDelete";
import { lightTheme } from "app/theme";
import { Club } from "api";
import { RootStackParamList } from "./Root";

export type ClubManagementStackParamList = {
  ClubManagementMain: { clubId: number };
  ClubEditBasics: { clubId: number; clubData: Club };
  ClubEditIntroduction: { clubId: number; clubData: Club };
  ClubEditMembers: { clubId: number; clubData: Club };
  ClubDelete: undefined;
};

const NativeStack = createNativeStackNavigator<ClubManagementStackParamList>();

const ClubManagementStack: React.FC<NativeStackScreenProps<RootStackParamList, "ClubManagementStack">> = ({ navigation, route }) => {
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
      <NativeStack.Screen name="ClubManagementMain" component={ClubManagementMain} options={{ headerShown: false }} />
      <NativeStack.Screen name="ClubEditBasics" component={ClubEditBasics} options={{ title: "모임 기본 사항 수정" }} />
      <NativeStack.Screen name="ClubEditIntroduction" component={ClubEditIntroduction} options={{ title: "소개글 수정" }} />
      <NativeStack.Screen name="ClubEditMembers" component={ClubEditMembers} options={{ title: "관리자 / 멤버 관리" }} />
      <NativeStack.Screen name="ClubDelete" component={ClubDelete} options={{ title: "모임 삭제" }} />
    </NativeStack.Navigator>
  );
};

export default ClubManagementStack;
