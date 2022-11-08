import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs";
import Profile from "../screens/Profile";
import CreateHomePeed from "../screens/HomeRelevant/CreateHomePeed";
import Accusation from "../screens/HomeRelevant/Accusation";
import ModifiyPeed from "../screens/HomeRelevant/ModifiyPeed";
import ImageSelecter from "../screens/HomeRelevant/ImageSelecter";
import ReportComplete from "../screens/HomeRelevant/ReportComplete";
import ReplyPage from "../screens/HomeRelevant/ReplyPage";
import MyClubSelector from "../screens/HomeRelevant/MyClubSelector";
import { Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useQuery, useMutation } from "react-query";
import { Feed, FeedCreationRequest, FeedsResponse } from "../api";
import styled from "styled-components/native";

const ImageSelectSave = styled.Text`
  color: #2995fa;
  margin-right: 5%;
`;

const NativeStack = createNativeStackNavigator();

const HomeStack = ({
                     navigation: { navigate },
                     route:{params:{feedData,userId,clubId}} }) => {
  const token = useSelector((state) => state.AuthReducers.authToken);

  const cancleCreate = () => {
    Alert.alert(
      "게시글을 삭제하시겠어요?",
      "30일 이내에 내 활동의 최근 삭제 항목에서 이 게시물을 복원할 수 있습니다." + "30일이 지나면 영구 삭제 됩니다. ",
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
        initialParams={{userId,clubId}}
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
        initialParams={{userId}}
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
        name="CreateHomePeed"
        component={CreateHomePeed}
        initialParams={{feedData}}
        options={{
          title: "새 게시물",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("Tabs", { screen: "ImageSelecter" })}>
              <Ionicons name="chevron-back" size={20} color="black" title="이미지선택" />
            </TouchableOpacity>
          ),
          headerShown: true,
        }}
      />
      <NativeStack.Screen
        name="ReplyPage"
        component={ReplyPage}
        initialParams={{feedData}}
        options={{
          title: "댓글",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("Tabs", { screen: "Home" })}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
          headerShown: true,
        }}
      />
      <NativeStack.Screen
        name="ModifiyPeed"
        component={ModifiyPeed}
        initialParams={{feedData}}
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

      <NativeStack.Screen
        name="Accusation"
        component={Accusation}
        initialParams={{feedData}}
        options={{
          title: "신고",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("Tabs", { screen: "Home" })}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
          headerShown: true,
        }}
      />
      <NativeStack.Screen
        name="ReportComplete"
        component={ReportComplete}
        options={{
          title: "신고완료",
          headerRight: () => (
            <TouchableOpacity onPress={() => navigate("Tabs", { screen: "Home" })}>
              <Text>완료</Text>
            </TouchableOpacity>
          ),
          headerShown: true,
        }}
      />
    </NativeStack.Navigator>
  );
};
export default HomeStack;
