import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Alert, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import Accusation from "../screens/HomeRelevant/Accusation";
import AlarmPage from "../screens/HomeRelevant/AlarmPage";
import CreateHomePeed from "../screens/HomeRelevant/CreateHomePeed";
import FeedCreate from "../screens/HomeRelevant/FeedCreate";
import ModifiyPeed from "../screens/HomeRelevant/ModifiyPeed";
import MyClubSelector from "../screens/HomeRelevant/MyClubSelector";
import ReplyPage from "../screens/HomeRelevant/ReplyPage";
import ReportComplete from "../screens/HomeRelevant/ReportComplete";
import Profile from "../screens/Profile";

const ImageSelectSave = styled.Text`
  color: #2995fa;
  margin-right: 5%;
`;

const NativeStack = createNativeStackNavigator();

const HomeStack = ({ navigation: { navigate } }) => {
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
        name="FeedCreate"
        component={FeedCreate}
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
        initialParams={{clubName}}
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
        initialParams={{userName, id}}
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
        initialParams={{userName, id, userId, content, imageUrls, clubId, clubName, hashtags}}
        options={{
          title: "수정",
          headerLeft: () => (
            <TouchableOpacity onPress={() => feedUpdate}>
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
