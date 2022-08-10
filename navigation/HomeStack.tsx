import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs";
import Profile from "../screens/Profile";
import CreateHomePeed from "../screens/HomeRelevant/CreateHomePeed";
import Accusation from "../screens/HomeRelevant/Accusation";
import ModifiyPeed from "../screens/HomeRelevant/ModifiyPeed";
import ImageSelecter from "../screens/HomeRelevant/ImageSelecter";
import ReportComplete from "../screens/HomeRelevant/ReportComplete";
import ReplyPage from "../screens/HomeRelevant/ReplyPage";
import AlarmPage from "../screens/HomeRelevant/AlarmPage";
import MyClubSelector from "../screens/HomeRelevant/MyClubSelector";
import { Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { Feed, FeedsResponse } from "../api";

const NativeStack = createNativeStackNavigator();

const HomeStack = ({ navigation: { navigate } }) => {
  //취소 알람
  const cancleCreate = () =>
    Alert.alert(
      // 말그대로 Alert를 띄운다
      "취소하시겠습니까?", // 첫번째 text: 타이틀 제목
      "게시글이 삭제됩니다.", // 두번째 text: 그 밑에 작은 제목
      [
        // 버튼 배열
        {
          text: "아니요",
          style: "cancel",
        },
        { text: "네", onPress: () => navigate("Home") },
      ],
      { cancelable: false }
    );

  //피드생성
  const getFeeds = () => {
    return fetch(`http://3.39.190.23:8080/api/feeds`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
  };
  const token = useSelector((state) => state.AuthReducers.authToken);
  const { data: feeds, isLoading: feedsLoading } = useQuery<FeedsResponse>(["getFeeds"], getFeeds, {
    //useQuery(["getFeeds", token], FeedApi.getFeeds, {
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.log(`[getFeeds error] ${err}`);
    },
  });

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
        name="AlarmPage"
        component={AlarmPage}
        options={{
          title: "알림",
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
