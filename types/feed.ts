import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Animated, GestureResponderEvent } from "react-native";
import { Reply } from "../api";

export type RootStackParamList = {
  HomeStack: {
    id: number;
    clubId: number;
    clubName: string | undefined;
    userId: number;
    userName: string | undefined;
    content: string | undefined;
    imageUrls: string;
    hastags: string | undefined;
    likeYn: boolean | undefined;
    likeCount: number;
    commentCount: number;
    created: string;
    updated: string;
  };
  ReplyPage: { replyData: Reply };
};
