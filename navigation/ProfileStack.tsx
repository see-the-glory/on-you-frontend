import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditProfile from "../screens/Profile/EditProfile";
import MyClub from "../screens/Profile/MyClub";
import NotificationSettings from "../screens/Profile/NotificationSettings";
import Notice from "../screens/Profile/Notice";
import Help from "../screens/Profile/Help";
import Terms from "../screens/Profile/Terms";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color } from "react-native-reanimated";

const NativeStack = createNativeStackNavigator();

const ProfileStack = ({ navigation: { navigate } }) => {
  return (
    <NativeStack.Navigator
      screenOptions={{
        presentation: "card",
        contentStyle: { backgroundColor: "white" },
      }}
    >
      <NativeStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          title: "프로필 수정",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("Tabs", { screen: "Profile" })}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => navigate("Tabs", { screen: "Profile" })}>
              <Text style={{ color: "#2995FA" }}>저장</Text>
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
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="NotificationSettings"
        component={NotificationSettings}
        options={{
          title: "알림설정",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("Tabs", { screen: "Profile" })}>
              <Ionicons name="chevron-back" size={20} color="black" />
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
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="Help"
        component={Help}
        options={{
          title: "고객센터/도움말",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("Tabs", { screen: "Profile" })}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <NativeStack.Screen
        name="Terms"
        component={Terms}
        options={{
          title: "약관",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("Tabs", { screen: "Profile" })}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </NativeStack.Navigator>
  );
};

export default ProfileStack;
