import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Animated, GestureResponderEvent } from "react-native";
import { Reply } from "../api";
import ImageSelecter from "../screens/HomeRelevant/ImageSelecter";

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
  ImageSelecter:{
    clubName:string
    clubId: number
  }
  ReplyPage: { replyData: Reply };
  
};

export type FeedCreate = NativeStackScreenProps<RootStackParamList,"ImageSelecter">