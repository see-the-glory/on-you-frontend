import React from "react";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import ClubScheduleAdd from "@components/pages/Club/ClubScheduleAdd";
import ClubTopTabs from "@components/pages/Club/ClubTopTabs";
import ClubJoin from "@components/pages/Club/ClubJoin";
import ClubNotification from "@components/pages/Club/ClubNotification";
import ClubApplication from "@components/pages/Club/ClubApplication";
import ClubScheduleEdit from "@components/pages/Club/ClubScheduleEdit";
import ClubFeedDetail from "@components/pages/Club/ClubFeedDetail";
import ClubJoinReject from "@components/pages/Club/ClubJoinReject";
import ClubJoinRejectMessage from "@components/pages/Club/ClubJoinRejectMessage";
import ClubInvitation from "@components/pages/Club/ClubInvitation";
import { lightTheme } from "app/theme";
import ClubMembers from "@components/pages/Club/ClubMembers";
import ClubGuestBook from "@components/pages/Club/ClubGuestBook";
import { Club, ClubRole, Member, RefinedSchedule } from "api";
import { RootStackParamList } from "./Root";

export type ClubStackParamList = {
  ClubTopTabs: { clubId: number; isNew?: boolean };
  ClubScheduleAdd: { clubData: Club };
  ClubScheduleEdit: { clubData: Club; scheduleData: RefinedSchedule };
  ClubJoin: { clubId: number };
  ClubNotification: { clubData: Club; clubRole: ClubRole };
  ClubApplication: { clubData: Club; actionId: number; actionerName?: string | null; actionerId?: number | null; message?: string | null; createdTime?: string; processDone?: boolean };
  ClubJoinReject: { clubId: number; actionId: number; actionerId?: number; actionerName?: string | null };
  ClubJoinRejectMessage: { clubName: string; message?: string | null; createdTime?: string };
  ClubInvitation: undefined;
  ClubFeedDetail: { clubData: Club; targetIndex: number; fetchNextPage?: Function };
  ClubMembers: { members: Member[] };
  ClubGuestBook: { clubId: number; clubData: Club };
};

const NativeStack = createNativeStackNavigator<ClubStackParamList>();

const ClubStack: React.FC<NativeStackScreenProps<RootStackParamList, "ClubStack">> = ({ route, navigation }) => {
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
      <NativeStack.Screen name="ClubMembers" component={ClubMembers} options={{ title: "멤버" }} />
      <NativeStack.Screen name="ClubGuestBook" component={ClubGuestBook} options={{ headerBackVisible: false }} />
    </NativeStack.Navigator>
  );
};

export default ClubStack;
