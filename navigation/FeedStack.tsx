import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FeedComments from "../screens/Feed/FeedComments";

const NativeStack = createNativeStackNavigator();

const FeedStack = ({
  route: {
    params: { feedId },
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
        initialParams={{ feedId }}
        options={{
          title: "댓글",
        }}
      />
    </NativeStack.Navigator>
  );
};

export default FeedStack;
