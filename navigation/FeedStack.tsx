import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FeedComments from "../screens/Feed/FeedComments";
import ImageSelecter from "../screens/FeedCreation/ImageSelecter";
import ModifiyFeed from "../screens/Feed/ModifiyFeed";
import MyClubSelector from "../screens/FeedCreation/MyClubSelector";
import FeedSelection from "../screens/Feed/FeedSelection";

const NativeStack = createNativeStackNavigator();

const FeedStack = ({ route: { params }, navigation: { navigate } }) => {
  return (
    <NativeStack.Navigator
      screenOptions={{
        presentation: "card",
        contentStyle: { backgroundColor: "white" },
        headerTitleAlign: "center",
        headerTitleStyle: { fontFamily: "NotoSansKR-Medium", fontSize: 16 },
      }}
    >
      <NativeStack.Screen name="FeedComments" component={FeedComments} options={{ title: "댓글" }} />
      <NativeStack.Screen name="ImageSelecter" component={ImageSelecter} options={{ title: "게시물 작성" }} />
      <NativeStack.Screen name="MyClubSelector" component={MyClubSelector} options={{ title: "나의 모임" }} />
      <NativeStack.Screen name="Feed" component={FeedSelection} options={{ title: "게시물" }} />
      <NativeStack.Screen name="ModifiyFeed" component={ModifiyFeed} options={{ title: "수정" }} />
    </NativeStack.Navigator>
  );
};

export default FeedStack;
