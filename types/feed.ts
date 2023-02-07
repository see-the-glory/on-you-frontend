import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Club, Feed, Reply } from "../api";

export type FeedStackParamList = {
  Home: {};

  FeedCreater: {
    imageUrls: string;
    userId: number;
    content: string;
    hashtag: string | undefined;
    created: string;
    clubId: number;
    clubName: string;
    userName: string;
    clubData: Club;
  };
  // ReplyPage: {userId: number, userName: string, id: number};
  ReplyPage: { feedData: Feed };
  MyClubSelector: { id: number; userId: number };
  FeedCreateSuccess: { feedData: Feed };
  FeedUpdate: { feedData: Feed };
  FeedReport: { feedData: Feed };
  Tabs: {};
  HomeStack: {};
};

export type HomeScreenProps = NativeStackScreenProps<FeedStackParamList, "Home">;
export type FeedCreateScreenProps = NativeStackScreenProps<FeedStackParamList, "FeedCreater">;
export type MyClubSelectorScreenProps = NativeStackScreenProps<FeedStackParamList, "MyClubSelector">;
export type ReplyPageScreenProps = NativeStackScreenProps<FeedStackParamList, "ReplyPage">;
export type ModifiyFeedScreenProps = NativeStackScreenProps<FeedStackParamList, "FeedUpdate">;
export type ReportFeedScreenProps = NativeStackScreenProps<FeedStackParamList, "FeedReport">;

export interface FeedData extends Feed {
  id: number;
  userId: number;
  isEnd: boolean;
}
