import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Animated, GestureResponderEvent } from "react-native";
import { Club, CategoryResponse, Schedule, Category, ClubRole, Member, Feed } from "../api";

// For Stack Navigation
export type ClubStackParamList = {
  Clubs: {};

  ClubStack: {};
  ClubTopTabs: { clubData: Club };
  ClubHome: { clubData: Club };
  ClubFeed: { clubData: Club };
  ClubFeedDetail: { clubData: Club; feedData: Feed[]; targetIndex: number };

  ClubCreationStack: {};
  ClubCreationStepOne: { category: CategoryResponse };
  ClubCreationStepTwo: { category1: number; category2: number };
  ClubCreationStepThree: {
    category1: number;
    category2: number;
    clubName: string;
    maxNumber: number;
    isApproveRequired: string;
    phoneNumber: string;
    organizationName: string;
    imageURI: string | null;
  };
  ClubCreationSuccess: {
    clubData: Club;
  };
  ClubCreationFail: {};

  ClubManagementStack: { clubData: Club };
  ClubManagementMain: { clubData: Club; refresh?: boolean };
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
export type ClubListScreenProps = NativeStackScreenProps<ClubStackParamList, "Clubs">;

export type ClubStackScreenProps = NativeStackScreenProps<ClubStackParamList, "ClubStack">;

export type ClubHomeScreenProps = NativeStackScreenProps<ClubStackParamList, "ClubHome">;
export type ClubFeedScreenProps = NativeStackScreenProps<ClubStackParamList, "ClubFeed">;
export type ClubFeedDetailScreenProps = NativeStackScreenProps<ClubStackParamList, "ClubFeedDetail">;

export type ClubCreationStackProps = NativeStackScreenProps<ClubStackParamList, "ClubCreationStack">;
export type ClubCreationStepOneScreenProps = NativeStackScreenProps<ClubStackParamList, "ClubCreationStepOne">;
export type ClubCreationStepTwoScreenProps = NativeStackScreenProps<ClubStackParamList, "ClubCreationStepTwo">;
export type ClubCreationStepThreeScreenProps = NativeStackScreenProps<ClubStackParamList, "ClubCreationStepThree">;
export type ClubCreationSuccessScreenProps = NativeStackScreenProps<ClubStackParamList, "ClubCreationSuccess">;
export type ClubCreationFailScreenProps = NativeStackScreenProps<ClubStackParamList, "ClubCreationFail">;

export type ClubManagementStackProps = NativeStackScreenProps<ClubStackParamList, "ClubManagementStack">;
export type ClubManagementMainProps = NativeStackScreenProps<ClubStackParamList, "ClubManagementMain">;
export type ClubEditBasicsProps = NativeStackScreenProps<ClubStackParamList, "ClubEditBasics">;
export type ClubEditIntroductionProps = NativeStackScreenProps<ClubStackParamList, "ClubEditIntroduction">;
export type ClubEditMembersProps = NativeStackScreenProps<ClubStackParamList, "ClubEditMembers">;
export type ClubDeleteProps = NativeStackScreenProps<ClubStackParamList, "ClubDelete">;

// ClubHome Param For Collapsed Scroll Animation
export interface ClubHomeParamList {
  scrollY: Animated.Value;
  headerDiff: number;
  offsetY?: number;
  scheduleOffsetX?: number;
  clubRole?: ClubRole;
  schedules?: RefinedSchedule[];
}

export interface ClubFeedParamList {
  scrollY: Animated.Value;
  offsetY?: number;
  headerDiff: number;
}

// ClubHome Header
export interface ClubHomeHaederProps extends ClubHomeParamList {
  imageURI?: string | null;
  name?: string;
  shortDesc?: string | null;
  categories?: Category[];
  recruitStatus?: string | null;
  schedules?: Schedule[] | undefined;
  heightExpanded: number;
  heightCollapsed: number;
}

// For TopTab Navigation
export type TopTabParamList = {
  ClubTopTabs: { clubData: Club };
};

export type ClubTopTabProps = MaterialTopTabScreenProps<TopTabParamList, "ClubTopTabs">;

export interface ClubHomeFloatingButtonProps {
  role?: "MASTER" | "MANAGER" | "MEMBER" | "PENDING" | null;
  recruitStatus?: "OPEN" | "CLOSE" | null;
  onPressEdit: Function;
  onPressJoin: Function;
}

export interface RefinedSchedule extends Schedule {
  year?: string;
  month?: string;
  day?: string;
  dayOfWeek?: string;
  hour?: string;
  minute?: string;
  ampm?: string;
  participation?: boolean;
  isEnd?: boolean;
}
