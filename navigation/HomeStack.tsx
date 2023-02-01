import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../screens/Profile";
import ModifiyFeed from "../screens/HomeRelevant/ModifiyFeed";
import ImageSelecter from "../screens/HomeRelevant/ImageSelecter";
import MyClubSelector from "../screens/HomeRelevant/MyClubSelector";
import { Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import styled from "styled-components/native";

const NativeStack = createNativeStackNavigator();

const HomeStack = ({
  navigation: { navigate },
  route: {
    params: { feedData, userId, clubId },
  },
}) => {
  const cancleCreate = () => {
    Alert.alert(
      "게시글을 생성을 취소하시겠어요?",
      "",
      // "30일 이내에 내 활동의 최근 삭제 항목에서 이 게시물을 복원할 수 있습니다." + "30일이 지나면 영구 삭제 됩니다. ",
      [
        {
          text: "아니요",
          onPress: () => console.log(""),
          style: "cancel",
        },
        { text: "네", onPress: () => navigate("Tabs", { screen: "Home" }) },
      ],
      { cancelable: false }
    );
  };

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
        name="Profile"
        component={Profile}
        options={{
          title: "내 정보",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("Tabs", { screen: "Home" })}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />

      <NativeStack.Screen
        name="ImageSelecter"
        component={ImageSelecter}
        initialParams={{ userId, clubId }}
        options={{
          title: "",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("HomeStack", { screen: "MyClubSelector" })}>
              <Ionicons name="chevron-back" size={25} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => navigate("Tabs", { screen: "Home" })}>
              <Text style={{ color: "#2995fa" }}>저장</Text>
            </TouchableOpacity>
          ),
          headerShown: true,
        }}
      />
      <NativeStack.Screen
        name="MyClubSelector"
        component={MyClubSelector}
        initialParams={{ userId }}
        options={{
          title: "나의 모임",
          headerLeft: () => (
            <TouchableOpacity onPress={cancleCreate}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
          headerShown: true,
        }}
      />
      <NativeStack.Screen
        name="ModifiyFeed"
        component={ModifiyFeed}
        initialParams={{ feedData }}
        options={{
          title: "수정",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("Tabs", { screen: "Home" })}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => navigate("Tabs", { screen: "Home" })}>
              <Text>완료</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </NativeStack.Navigator>
  );
};
export default HomeStack;
