import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditProfile from "../screens/Profile/EditProfile";
import Notice from "../screens/Profile/Notice";
import Account from "../screens/Profile/Account";
import { TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import NotificationSetting from "../screens/Profile/NotificationSetting";
import Suggestion from "../screens/Profile/Suggestion";
import Info from "../screens/Profile/Info";
import BlockUserList from "../screens/Profile/BlockUserList";
import UserNotification from "../screens/Profile/UserNotification";
import ChangePassword from "../screens/Profile/ChangePassword";
import MyClubs from "../screens/Profile/MyClubs";

const NativeStack = createNativeStackNavigator();

const ProfileStack = ({
  route: {
    params: { userData, category },
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
      <NativeStack.Screen name="EditProfile" component={EditProfile} options={{ title: "프로필 수정" }} />
      <NativeStack.Screen name="MyClubs" component={MyClubs} options={{ title: "나의 모임" }} />
      <NativeStack.Screen name="Account" component={Account} options={{ title: "계정" }} />
      <NativeStack.Screen name="ChangePassword" component={ChangePassword} options={{ title: "비밀번호 변경" }} />
      <NativeStack.Screen name="BlockUserList" component={BlockUserList} options={{ title: "차단된 계정" }} />
      <NativeStack.Screen name="NotificationSetting" component={NotificationSetting} options={{ title: "알림 설정" }} />
      <NativeStack.Screen name="Suggestion" component={Suggestion} options={{ title: "건의사항 요청" }} />
      <NativeStack.Screen name="Notice" component={Notice} options={{ title: "공지사항" }} />
      <NativeStack.Screen name="Info" component={Info} options={{ title: "정보" }} />
      <NativeStack.Screen name="UserNotification" component={UserNotification} options={{ title: "개인 소식" }} />
    </NativeStack.Navigator>
  );
};

export default ProfileStack;
