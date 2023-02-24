import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditProfile from "../screens/Profile/EditProfile";
import MyClub from "../screens/Profile/MyClub";
import ChangePw from "../screens/Profile/ChangePw";
import Notice from "../screens/Profile/Notice";
import Account from "../screens/Profile/Account";
import { TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import NotificationSetting from "../screens/Profile/NotificationSetting";
import Suggestion from "../screens/Profile/Suggestion";
import Info from "../screens/Profile/Info";
import BlockUserList from "../screens/Profile/BlockUserList";

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
      <NativeStack.Screen
        name="EditProfile"
        component={EditProfile}
        initialParams={{ userData, category }}
        options={{
          title: "프로필 수정",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("Tabs", { screen: "Profile" })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="MyClub"
        component={MyClub}
        options={{
          title: "나의 모임",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("Tabs", { screen: "Profile" })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="Account"
        component={Account}
        options={{
          title: "계정",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("Tabs", { screen: "Profile" })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="ChangePw"
        component={ChangePw}
        options={{
          title: "비밀번호 재설정",
        }}
      />

      <NativeStack.Screen
        name="BlockUserList"
        component={BlockUserList}
        options={{
          title: "차단된 계정",
        }}
      />

      <NativeStack.Screen
        name="NotificationSetting"
        component={NotificationSetting}
        options={{
          title: "알림 설정",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("Tabs", { screen: "Profile" })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="Suggestion"
        component={Suggestion}
        options={{
          title: "건의사항 요청",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("Tabs", { screen: "Profile" })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />

      <NativeStack.Screen
        name="Notice"
        component={Notice}
        options={{
          title: "공지사항",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("Tabs", { screen: "Profile" })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="Info"
        component={Info}
        options={{
          title: "정보",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("Tabs", { screen: "Profile" })}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </NativeStack.Navigator>
  );
};

export default ProfileStack;
