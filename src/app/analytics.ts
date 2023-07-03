import analytics from "@react-native-firebase/analytics";
import { Club, Feed, GuestComment, UserProfile } from "api";

export interface ClubEventParams {
  club_id: number;
  club_name: string | null;
  organization_name: string | null;
  category1_id: number | null;
  category2_id: number | null;
  category1_name: string | null;
  category2_name: string | null;
}

export interface ProfileEventParams {
  user_id: number;
  birthday: string | null;
}

export interface FeedEventParams {
  feed_id: number;
  club_id: number;
  club_name: string;
  image_count: number;
}

export interface CommentEventParams {
  comment_id: number | null;
  feed_id: number;
  club_id: number;
  user_id: number | null;
  comment_type: "normal" | "reply";
}

export interface ClubJoinEventParams {
  club_id: number;
  club_name: string | null;
}

const DataType = {
  club: "club",
  profile: "profile",
  feed: "feed",
  comment: "comment",
};

const dataToParams = (type: string, data: any) => {
  switch (type) {
    case DataType.club:
      const categories = data?.categories;
      const clubParams: ClubEventParams = {
        club_id: data?.id,
        club_name: data?.name ?? null,
        organization_name: data?.organizationName ?? null,
        category1_id: categories?.length && categories?.length > 0 ? categories[0].id : null,
        category2_id: categories?.length && categories?.length > 1 ? categories[1].id : null,
        category1_name: categories?.length && categories?.length > 0 ? categories[0].name : null,
        category2_name: categories?.length && categories?.length > 1 ? categories[1].name : null,
      };
      return clubParams;
    case DataType.profile:
      const profileParams: ProfileEventParams = {
        user_id: data.userId,
        birthday: data.birthday,
      };
      return profileParams;
  }
};

export const loginEvent = () => {
  const params = { method: "onyou" };
  analytics().logLogin(params);
};

export const setUserProperties = (userId?: number, birthday?: string | null, sex?: string | null, organizationName?: string) => {
  if (!userId) return;
  analytics().setUserId(`${userId}`);
  analytics().setUserProperties({ birthday: birthday ?? null, sex: sex ?? null, organization_name: organizationName ?? null }, { global: true });
};

export const clearUserProperties = () => {
  analytics().resetAnalyticsData();
};

export const searchEvent = (keyword: string) => {
  if (!keyword || keyword === "") return;
  analytics().logViewSearchResults({ search_term: keyword });
};

export const createClubEvent = (data: Club) => {
  if (!data?.id) return;
  const params = dataToParams(DataType.club, data);
  analytics().logEvent("create_club", params);
};

export const selectClubEvent = (data: Club) => {
  if (!data?.id) return;
  const params = dataToParams(DataType.club, data);
  if (params) analytics().logEvent("select_club", params);
};

export const selectProfileEvent = (userId: number, data?: UserProfile) => {
  if (!userId) return;
  const params = dataToParams(DataType.profile, { userId, ...data });
  console.log(params);
  analytics().logEvent("select_profile", params);
};

export const createFeedEvent = (params: FeedEventParams) => {
  if (!params?.feed_id) return;
  analytics().logEvent("create_feed", params);
};

export const createCommentEvent = (params: CommentEventParams) => {
  if (!params) return;
  // club / feed / user
  // 댓글인지 답글인지
  analytics().logEvent("create_feed_comment", params);
};

export const createGuestCommentEvent = (guestComment: GuestComment) => {
  if (!guestComment) return;
  // club / user
  // analytics().logEvent("create_guest_comment", { guestComment_id: guestComment?.id });
};

export const clubJoinEvent = (params: ClubJoinEventParams) => {
  if (!params?.club_id) return;
  analytics().logEvent("request_join_club", params);
};
