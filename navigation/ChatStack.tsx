import React from "react";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { lightTheme } from "../theme";
import { RootStackParamList } from "./Root";
import ChatDetail from "../components/pages/Chat/ChatDetail";

export type ChatStackParamList = {
  ChatDetail: undefined;
};

const NativeStack = createNativeStackNavigator<ChatStackParamList>();

const ChatStack: React.FC<NativeStackScreenProps<RootStackParamList, "ChatStack">> = ({ route, navigation }) => {
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
      <NativeStack.Screen name="ChatDetail" component={ChatDetail} />
    </NativeStack.Navigator>
  );
};

export default ChatStack;
