import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FeedComments from "../screens/Feed/FeedComments";
import ImageSelecter from "../screens/FeedCreation/ImageSelecter";
import ModifiyFeed from "../screens/Feed/ModifiyFeed";
import MyClubSelector from "../screens/FeedCreation/MyClubSelector";

const NativeStack = createNativeStackNavigator();

const FeedStack = ({
  route: {
    params: { feedIndex, feedId, clubId, userId, feedData },
  },
  navigation: { navigate },
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
        name="FeedComments"
        component={FeedComments}
        initialParams={{ feedIndex, feedId, clubId }}
        options={{
          title: "댓글",
        }}
      />

      <NativeStack.Screen
        name="ImageSelecter"
        component={ImageSelecter}
        initialParams={{ userId, clubId }}
        options={{
          title: "",
          headerShown: true,
        }}
      />
      <NativeStack.Screen
        name="MyClubSelector"
        component={MyClubSelector}
        initialParams={{ userId }}
        options={{
          title: "나의 모임",
          headerShown: true,
        }}
      />
      <NativeStack.Screen name="ModifiyFeed" component={ModifiyFeed} initialParams={{ feedData }} options={{ title: "수정" }} />
    </NativeStack.Navigator>
  );
};

export default FeedStack;
