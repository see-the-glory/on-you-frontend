import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ClubScheduleAdd from "../screens/Club/ClubScheduleAdd";
import ClubTopTabs from "../screens/Club/ClubTopTabs";
import { Entypo } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import ClubJoin from "../screens/Club/ClubJoin";

const NativeStack = createNativeStackNavigator();

const ClubStack = ({
  route: {
    params: { clubData },
  },
  navigation,
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
        name="ClubTopTabs"
        component={ClubTopTabs}
        initialParams={{ clubData }}
        options={{
          headerShown: false,
        }}
      />

      <NativeStack.Screen
        name="ClubScheduleAdd"
        component={ClubScheduleAdd}
        initialParams={{ clubData }}
        options={{
          title: "스케줄 등록",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate("ClubTopTabs", { clubData })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />

      <NativeStack.Screen
        name="ClubJoin"
        component={ClubJoin}
        initialParams={{ clubData }}
        options={{
          title: "클럽 가입 신청",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate("ClubTopTabs", { clubData })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </NativeStack.Navigator>
  );
};

export default ClubStack;
