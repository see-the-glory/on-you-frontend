import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Animated, GestureResponderEvent } from "react-native";
import { Club, CategoryResponse, Schedule, Category, ClubRole } from "../api";

// For Stack Navigation
export type RootStackParamList = {
  Clubs: {};

  ClubStack: {};
  ClubTopTabs: { clubData: Club };
  ClubHome: { clubData: Club };
  ClubFeed: {};

  ClubCreationStack: {};
  ClubCreationStepOne: { category: CategoryResponse };
  ClubCreationStepTwo: { category1: number; category2: number };
  ClubCreationStepThree: {
    category1: number;
    category2: number;
    clubName: string;
    clubMemberCount: number;
    approvalMethod: number;
    imageURI: string | null;
  };
  ClubCreationSuccess: {
    clubData: Club;
  };
  ClubCreationFail: {};

  ClubManagementStack: { clubData: Club };
  ClubManagementMain: { clubData: Club };
  ClubEditBasics: { clubData: Club };
  ClubEditIntroduction: { clubData: Club };
  ClubEditMembers: { clubData: Club };
  ClubDelete: { clubData: Club };

  Tabs: {};
};

export type MainBottomTabParamList = {
  Home: {};
  Search: {};
  Clubs: {};
  Profile: {};
};

// For Screens
export type ClubListScreenProps = NativeStackScreenProps<RootStackParamList, "Clubs">;

export type ClubStackScreenProps = NativeStackScreenProps<RootStackParamList, "ClubStack">;

export type ClubHomeScreenProps = NativeStackScreenProps<RootStackParamList, "ClubHome">;

export type ClubCreationStackProps = NativeStackScreenProps<RootStackParamList, "ClubCreationStack">;
export type ClubCreationStepOneScreenProps = NativeStackScreenProps<RootStackParamList, "ClubCreationStepOne">;
export type ClubCreationStepTwoScreenProps = NativeStackScreenProps<RootStackParamList, "ClubCreationStepTwo">;
export type ClubCreationStepThreeScreenProps = NativeStackScreenProps<RootStackParamList, "ClubCreationStepThree">;
export type ClubCreationSuccessScreenProps = NativeStackScreenProps<RootStackParamList, "ClubCreationSuccess">;
export type ClubCreationFailScreenProps = NativeStackScreenProps<RootStackParamList, "ClubCreationFail">;

export type ClubManagementStackProps = NativeStackScreenProps<RootStackParamList, "ClubManagementStack">;
export type ClubmanagementMainProps = NativeStackScreenProps<RootStackParamList, "ClubManagementMain">;
export type ClubEditBasicsProps = NativeStackScreenProps<RootStackParamList, "ClubEditBasics">;
export type ClubEditIntroductionProps = NativeStackScreenProps<RootStackParamList, "ClubEditIntroduction">;
export type ClubDeleteProps = NativeStackScreenProps<RootStackParamList, "ClubDelete">;

// ClubHome Param For Collapsed Scroll Animation
export interface ClubHomeParamList {
  scrollY: Animated.Value;
  headerDiff: number;
}

// ClubHome Header
export interface ClubHomeHaederProps extends ClubHomeParamList {
  imageURI: string | null;
  name: string;
  shortDesc: string | null;
  categories: Category[];
  recruitStatus: string;
  heightExpanded: number;
  heightCollapsed: number;
}

// For TopTab Navigation
export type TopTabParamList = {
  ClubTopTabs: { clubData: Club };
};

export type ClubTopTabProps = MaterialTopTabScreenProps<TopTabParamList, "ClubTopTabs">;

export interface ClubHomeFloatingButtonProps {
  role: "MASTER" | "MANAGER" | "MEMBER" | undefined;
  applyStatus: "APPLIED" | "APPROVED" | undefined;
  onPressEdit: Function;
  onPressJoin: Function;
}

export interface RefinedSchedule extends Schedule {
  year: string;
  month: string;
  day: string;
  dayOfWeek: string;
  hour: string;
  minute: string;
  ampm: string;
  isEnd: boolean;
}
