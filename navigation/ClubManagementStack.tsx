import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Entypo } from "@expo/vector-icons";
import { ClubManagementStackProps, RootStackParamList } from "../types/Club";
import ClubEditBasics from "../screens/ClubManagement/ClubEditBasics";
import ClubManagementMain from "../screens/ClubManagement/ClubManagementMain";
import ClubEditIntroduction from "../screens/ClubManagement/ClubEditIntroduction";
import ClubEditMembers from "../screens/ClubManagement/ClubEditMembers";
import ClubDelete from "../screens/ClubManagement/ClubDelete";
import { TouchableOpacity } from "react-native";

const NativeStack = createNativeStackNavigator<RootStackParamList>();

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
      <NativeStack.Screen
        name="ClubManagementMain"
        component={ClubManagementMain}
        initialParams={{ clubData }}
        options={{
          headerShown: false,
        }}
      />

      <NativeStack.Screen
        name="ClubEditBasics"
        component={ClubEditBasics}
        initialParams={{ clubData }}
        options={{
          title: "모임 기본 사항 수정",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate("ClubManagementMain", { clubData })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="ClubEditIntroduction"
        component={ClubEditIntroduction}
        initialParams={{ clubData }}
        options={{
          title: "소개글 수정",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate("ClubManagementMain", { clubData })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="ClubEditMembers"
        component={ClubEditMembers}
        initialParams={{ clubData }}
        options={{
          title: "관리자 / 멤버 관리",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate("ClubManagementMain", { clubData })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="ClubDelete"
        component={ClubDelete}
        initialParams={{ clubData }}
        options={{
          title: "모임 삭제",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate("ClubManagementMain", { clubData })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </NativeStack.Navigator>
  );
};

export default ClubManagementStack;
