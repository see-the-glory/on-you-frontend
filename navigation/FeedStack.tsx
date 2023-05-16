import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FeedComments from "../screens/Feed/FeedComments";
import ImageSelection from "../screens/FeedCreation/ImageSelection";
import FeedModification from "../screens/Feed/FeedModification";
import ClubSelection from "../screens/FeedCreation/ClubSelection";
import FeedSelection from "../screens/Feed/FeedSelection";
import FeedLikes from "../screens/Feed/FeedLikes";

const NativeStack = createNativeStackNavigator();

const FeedStack = ({ route: { params }, navigation: { navigate } }) => {
  return (
    <NativeStack.Navigator
      screenOptions={{
        presentation: "card",
        contentStyle: { backgroundColor: "white" },
        headerTitleAlign: "center",
        headerTitleStyle: { fontFamily: "AppleSDGothicNeoB", fontSize: 16 },
        headerShadowVisible: false,
      }}
    >
      <NativeStack.Screen name="FeedComments" component={FeedComments} options={{ title: "댓글" }} />
      <NativeStack.Screen name="FeedLikes" component={FeedLikes} options={{ title: "좋아요" }} />
      <NativeStack.Screen name="ImageSelection" component={ImageSelection} options={{ title: "게시물 작성" }} />
      <NativeStack.Screen name="ClubSelection" component={ClubSelection} options={{ title: "모임 선택" }} />
      <NativeStack.Screen name="FeedSelection" component={FeedSelection} options={{ title: "게시물" }} />
      <NativeStack.Screen name="FeedModification" component={FeedModification} options={{ title: "수정" }} />
    </NativeStack.Navigator>
  );
};

export default FeedStack;
