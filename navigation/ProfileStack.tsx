import React from "react";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import Profile from "../components/pages/Profile/Profile";
import AccountEdit from "../components/pages/Preferences/AccountEdit";
import MyClubs from "../components/pages/Preferences/Activity/MyClubs";
import AccountSetting from "../components/pages/Preferences/Settings/AccountSetting";
import ChangePassword from "../components/pages/Preferences/Settings/ChangePassword";
import BlockUserList from "../components/pages/Preferences/Settings/BlockUserList";
import NotificationSetting from "../components/pages/Preferences/Settings/NotificationSetting";
import Suggestion from "../components/pages/Preferences/Others/Suggestion";
import SuggestionSuccess from "../components/pages/Preferences/Others/SuggestionSuccess";
import Notice from "../components/pages/Preferences/Others/Notice";
import Info from "../components/pages/Preferences/Others/Info";
import UserNotification from "../components/pages/Profile/UserNotification";
import Preferences from "../components/pages/Preferences/Preferences";
import { lightTheme } from "../theme";
import ProfileEdit from "../components/pages/Profile/ProfileEdit";
import UserFeedDetail from "../components/pages/Profile/UserFeedDetail";
import { MainBottomTabParamList } from "./Tabs";
import { User, UserProfile } from "../api";
import { RootStackParamList } from "./Root";

export type ProfileStackParamList = {
  Profile: { userId?: number };
  ProfileEdit: { profile: UserProfile; headerHeight: number };
  UserFeedDetail: { userId: number; profile: UserProfile; targetIndex: number; fetchNextPage?: Function };
  Preferences: undefined;
  AccountEdit: { userData?: User };
  MyClubs: undefined;
  AccountSetting: undefined;
  ChangePassword: undefined;
  BlockUserList: undefined;
  NotificationSetting: undefined;
  Suggestion: undefined;
  SuggestionSuccess: { content?: string };
  Notice: undefined;
  Info: undefined;
  UserNotification: undefined;
};

const NativeStack = createNativeStackNavigator<ProfileStackParamList & MainBottomTabParamList>();

const ProfileStack: React.FC<NativeStackScreenProps<RootStackParamList, "ProfileStack">> = ({ route, navigation }) => {
  return (
    <NativeStack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        presentation: "card",
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: "white" },
        headerTitleStyle: { fontFamily: lightTheme.koreanFontB, fontSize: 16 },
        headerShadowVisible: false,
      }}
    >
      <NativeStack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      <NativeStack.Screen name="ProfileEdit" component={ProfileEdit} options={{ headerShown: false }} />
      <NativeStack.Screen name="UserFeedDetail" component={UserFeedDetail} options={{ headerBackVisible: false }} />
      <NativeStack.Screen name="Preferences" component={Preferences} options={{ title: "설정" }} />
      <NativeStack.Screen name="AccountEdit" component={AccountEdit} options={{ title: "프로필 수정" }} />
      <NativeStack.Screen name="MyClubs" component={MyClubs} options={{ title: "나의 모임 관리" }} />
      <NativeStack.Screen name="AccountSetting" component={AccountSetting} options={{ title: "계정" }} />
      <NativeStack.Screen name="ChangePassword" component={ChangePassword} options={{ title: "비밀번호 변경" }} />
      <NativeStack.Screen name="BlockUserList" component={BlockUserList} options={{ title: "차단된 계정" }} />
      <NativeStack.Screen name="NotificationSetting" component={NotificationSetting} options={{ title: "알림 설정" }} />
      <NativeStack.Screen name="Suggestion" component={Suggestion} options={{ title: "건의사항 요청" }} />
      <NativeStack.Screen name="SuggestionSuccess" component={SuggestionSuccess} options={{ title: "건의사항 요청" }} />
      <NativeStack.Screen name="Notice" component={Notice} options={{ title: "공지사항" }} />
      <NativeStack.Screen name="Info" component={Info} options={{ title: "정보" }} />
      <NativeStack.Screen name="UserNotification" component={UserNotification} options={{ title: "개인 소식" }} />
    </NativeStack.Navigator>
  );
};

export default ProfileStack;
