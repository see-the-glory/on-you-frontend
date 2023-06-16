import React from "react";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import FeedComments from "../components/pages/Feed/FeedComments";
import ImageSelection from "../components/pages/FeedCreation/ImageSelection";
import FeedModification from "../components/pages/Feed/FeedModification";
import ClubSelection from "../components/pages/FeedCreation/ClubSelection";
import FeedSelection from "../components/pages/Feed/FeedSelection";
import FeedLikes from "../components/pages/Feed/FeedLikes";
import { lightTheme } from "../theme";
import { Feed, LikeUser } from "../api";
import { RootStackParamList } from "./Root";

export type FeedStackParamList = {
  FeedComments: { feedId: number; clubId: number };
  FeedLikes: { likeUsers: LikeUser[] };
  ImageSelection: { clubId: number };
  ClubSelection: undefined;
  FeedSelection: { selectFeedId: number };
  FeedModification: { feedData: Feed };
};

const NativeStack = createNativeStackNavigator<FeedStackParamList>();

const FeedStack: React.FC<NativeStackScreenProps<RootStackParamList, "FeedStack">> = ({ route, navigation }) => {
  return (
    <NativeStack.Navigator
      screenOptions={{
        presentation: "card",
        contentStyle: { backgroundColor: "white" },
        headerTitleAlign: "center",
        headerTitleStyle: { fontFamily: lightTheme.koreanFontB, fontSize: 16 },
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
