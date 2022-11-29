import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Club, Feed, Reply } from "../api";

export type RootStackParamList = {
  Home:{feedData:Feed}
  FeedCreater:{
    imageUrls: string;
    userId: number;
    content: string;
    hashtag: string | undefined;
    created: string;
    clubId: number;
    clubName: string;
    userName: string;
    clubData:Club
  }
  // ReplyPage: {userId: number, userName: string, id: number};
  ReplyPage: {feedData:Feed};
  MyClubSelector:{id:number,userId:number}
  FeedCreateSuccess:{feedData: Feed}
  FeedUpdate:{feedData:Feed}
  FeedReport:{feedData:Feed}
  Tabs:{}
  HomeStack:{}
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList,"Home">
export type FeedCreateScreenProps = NativeStackScreenProps<RootStackParamList,"FeedCreater">
export type MyClubSelectorScreenProps = NativeStackScreenProps<RootStackParamList,"MyClubSelector">
export type ReplyPageScreenProps = NativeStackScreenProps<RootStackParamList,"ReplyPage">
export type ModifiyPeedScreenProps = NativeStackScreenProps<RootStackParamList,"FeedUpdate">
export type ReportPeedScreenProps = NativeStackScreenProps<RootStackParamList,"FeedReport">

export interface FeedData extends Feed{
  id:number;
  userId: number;
  isEnd: boolean
}