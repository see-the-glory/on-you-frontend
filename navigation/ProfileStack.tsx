import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../screens/Profile/Profile";
import AccountEdit from "../screens/Preferences/AccountEdit";
import MyClubs from "../screens/Preferences/Activity/MyClubs";
import AccountSetting from "../screens/Preferences/Settings/AccountSetting";
import ChangePassword from "../screens/Preferences/Settings/ChangePassword";
import BlockUserList from "../screens/Preferences/Settings/BlockUserList";
import NotificationSetting from "../screens/Preferences/Settings/NotificationSetting";
import Suggestion from "../screens/Preferences/Others/Suggestion";
import SuggestionSuccess from "../screens/Preferences/Others/SuggestionSuccess";
import Notice from "../screens/Preferences/Others/Notice";
import Info from "../screens/Preferences/Others/Info";
import UserNotification from "../screens/Profile/UserNotification";
import Preferences from "../screens/Preferences/Preferences";

const NativeStack = createNativeStackNavigator();

const ProfileStack = ({ route: { params }, navigation: { navigate, goBack } }) => {
  return (
    <NativeStack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        presentation: "card",
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: "white" },
        headerTitleStyle: { fontFamily: "AppleSDGothicNeoB", fontSize: 16 },
        headerShadowVisible: false,
      }}
    >
      <NativeStack.Screen name="Profile" component={Profile} initialParams={{}} options={{ headerShown: false }} />
      <NativeStack.Screen name="Preferences" component={Preferences} options={{ title: "설정" }} />
      <NativeStack.Screen name="AccountEdit" component={AccountEdit} options={{ title: "프로필 수정" }} />
      <NativeStack.Screen name="MyClubs" component={MyClubs} options={{ title: "나의 모임" }} />
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
