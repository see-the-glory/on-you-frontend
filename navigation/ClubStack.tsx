import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ClubScheduleAdd from "../screens/Club/ClubScheduleAdd";
import ClubTopTabs from "../screens/Club/ClubTopTabs";
import ClubJoin from "../screens/Club/ClubJoin";
import ClubNotification from "../screens/Club/ClubNotification";
import ClubApplication from "../screens/Club/ClubApplication";
import ClubScheduleEdit from "../screens/Club/ClubScheduleEdit";
import ClubFeedDetail from "../screens/Club/ClubFeedDetail";
import ClubJoinReject from "../screens/Club/ClubJoinReject";
import ClubJoinRejectMessage from "../screens/Club/ClubJoinRejectMessage";
import ClubInvitation from "../screens/Club/ClubInvitation";

const NativeStack = createNativeStackNavigator();

const ClubStack = ({ route: { params }, navigation: { navigate, goBack } }) => {
  return (
    <NativeStack.Navigator
      screenOptions={{
        presentation: "card",
        contentStyle: { backgroundColor: "white" },
        headerTitleAlign: "center",
        headerTitleStyle: { fontFamily: "NotoSansKR-Medium", fontSize: 16 },
      }}
    >
      <NativeStack.Screen name="ClubTopTabs" component={ClubTopTabs} options={{ headerShown: false }} />
      <NativeStack.Screen name="ClubScheduleAdd" component={ClubScheduleAdd} options={{ title: "스케줄 등록" }} />
      <NativeStack.Screen name="ClubScheduleEdit" component={ClubScheduleEdit} options={{ title: "스케줄 수정" }} />
      <NativeStack.Screen name="ClubJoin" component={ClubJoin} options={{ title: "모임 가입 신청" }} />
      <NativeStack.Screen name="ClubNotification" component={ClubNotification} options={{ title: "모임 소식" }} />
      <NativeStack.Screen name="ClubApplication" component={ClubApplication} options={{ title: "가입 요청" }} />
      <NativeStack.Screen name="ClubJoinReject" component={ClubJoinReject} options={{ title: "가입 거절" }} />
      <NativeStack.Screen name="ClubJoinRejectMessage" component={ClubJoinRejectMessage} options={{ title: "가입 거절" }} />
      <NativeStack.Screen name="ClubInvitation" component={ClubInvitation} options={{ title: "모임 초대" }} />
      <NativeStack.Screen name="ClubFeedDetail" component={ClubFeedDetail} options={{ headerBackVisible: false }} />
    </NativeStack.Navigator>
  );
};

export default ClubStack;
