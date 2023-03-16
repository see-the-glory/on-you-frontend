import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ClubScheduleAdd from "../screens/Club/ClubScheduleAdd";
import ClubTopTabs from "../screens/Club/ClubTopTabs";
import { Entypo } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import ClubJoin from "../screens/Club/ClubJoin";
import ClubNotification from "../screens/Club/ClubNotification";
import ClubApplication from "../screens/Club/ClubApplication";
import ClubScheduleEdit from "../screens/Club/ClubScheduleEdit";
import ClubFeedDetail from "../screens/Club/ClubFeedDetail";
import ClubJoinReject from "../screens/Club/ClubJoinReject";
import ClubJoinRejectMessage from "../screens/Club/ClubJoinRejectMessage";

const NativeStack = createNativeStackNavigator();

const ClubStack = ({
  route: {
    params: { clubData, scheduleData, clubRole, targetIndex },
  },
  navigation: { navigate, goBack },
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
            <TouchableOpacity onPress={() => navigate("ClubTopTabs", { clubData })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="ClubScheduleEdit"
        component={ClubScheduleEdit}
        initialParams={{ clubData, scheduleData }}
        options={{
          title: "스케줄 수정",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("ClubTopTabs", { clubData })}>
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
          title: "모임 가입 신청",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("ClubTopTabs", { clubData })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />

      <NativeStack.Screen
        name="ClubNotification"
        component={ClubNotification}
        initialParams={{ clubData, clubRole }}
        options={{
          title: "모임 소식",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("ClubTopTabs", { clubData })}>
              <Entypo name="chevron-thin-left" size={20} color="black"></Entypo>
            </TouchableOpacity>
          ),
        }}
      />

      <NativeStack.Screen
        name="ClubApplication"
        component={ClubApplication}
        options={{
          title: "가입 요청",
        }}
      />

      <NativeStack.Screen
        name="ClubJoinReject"
        component={ClubJoinReject}
        options={{
          title: "가입 거절",
        }}
      />

      <NativeStack.Screen
        name="ClubJoinRejectMessage"
        component={ClubJoinRejectMessage}
        options={{
          title: "가입 거절",
        }}
      />

      <NativeStack.Screen
        name="ClubFeedDetail"
        component={ClubFeedDetail}
        initialParams={{ clubData, targetIndex }}
        options={{
          headerBackVisible: false,
        }}
      />
    </NativeStack.Navigator>
  );
};

export default ClubStack;
