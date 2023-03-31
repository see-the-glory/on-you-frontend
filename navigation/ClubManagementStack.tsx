import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Entypo } from "@expo/vector-icons";
import { ClubManagementStackProps, ClubStackParamList } from "../Types/Club";
import ClubEditBasics from "../screens/ClubManagement/ClubEditBasics";
import ClubManagementMain from "../screens/ClubManagement/ClubManagementMain";
import ClubEditIntroduction from "../screens/ClubManagement/ClubEditIntroduction";
import ClubEditMembers from "../screens/ClubManagement/ClubEditMembers";
import ClubDelete from "../screens/ClubManagement/ClubDelete";
import { TouchableOpacity } from "react-native";

const NativeStack = createNativeStackNavigator<ClubStackParamList>();

const ClubManagementStack: React.FC<ClubManagementStackProps> = ({
  navigation,
  route: {
    params: { clubData },
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
      <NativeStack.Screen name="ClubManagementMain" component={ClubManagementMain} options={{ headerShown: false }} />
      <NativeStack.Screen name="ClubEditBasics" component={ClubEditBasics} options={{ title: "모임 기본 사항 수정" }} />
      <NativeStack.Screen name="ClubEditIntroduction" component={ClubEditIntroduction} options={{ title: "소개글 수정" }} />
      <NativeStack.Screen name="ClubEditMembers" component={ClubEditMembers} options={{ title: "관리자 / 멤버 관리" }} />
      <NativeStack.Screen name="ClubDelete" component={ClubDelete} options={{ title: "모임 삭제" }} />
    </NativeStack.Navigator>
  );
};

export default ClubManagementStack;
