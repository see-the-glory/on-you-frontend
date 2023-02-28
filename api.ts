import axios from "axios";
const BASE_URL = "http://3.39.190.23:8080";

export interface BaseResponse {
  resultCode?: string;
  transactionTime?: string;
  status?: number;
}

export interface ErrorResponse {
  error?: string;
  message?: string;
  transactionTime?: string;
  status?: number;
  code: string;
}

export interface Category {
  id: number;
  description: string;
  name: string;
  thumbnail: string | null;
  order: number | null;
}

export interface Club {
  id: number;
  name?: string;
  clubShortDesc?: string | null;
  clubLongDesc?: string | null;
  announcement?: string | null;
  organizationName?: string;
  isApprovedRequired?: string;
  members?: Member[];
  maxNumber?: number;
  recruitNumber?: number;
  thumbnail?: string | null;
  recruitStatus?: "OPEN" | "CLOSE" | null;
  creatorName?: string;
  created?: string;
  categories?: Category[];
  contactPhone?: string | null;
  customCursor?: string;
}

export interface MyClub extends Club {
  applyStatus: string;
}

export interface Notification {
  actionId: number;
  actionerId?: number | null;
  actionerName?: string | null;
  actioneeId?: number | null;
  actioneeName?: string | null;
  actionType?: string;
  applyMessage?: string | null;
  created?: string;
  processDone?: boolean;
}

export interface Member {
  id: number;
  organizationName: string;
  thumbnail: string;
  name: string;
  birthday: string;
  applyStatus: string;
  sex: string;
  email: string;
  created: string;
  role: string | null;
  phoneNumber: string | null;
}

export interface Schedule {
  id?: number;
  name?: string;
  content?: string;
  members?: Member[];
  location?: string;
  startDate?: string;
  endDate?: string | null;
}

export interface User {
  applyStatus: string;
  birthday: string;
  created: string;
  email: string;
  id: number;
  name: string;
  organizationName: string;
  role: string;
  sex: string;
  thumbnail: string | null;
  phoneNumber: string;
  interests: [];
}

export interface BlockUser {
  userId: number;
  userName: string;
  thumbnail: string | null;
  organizationName: string;
}
export interface Feed {
  id: number;
  clubId: number;
  clubName: string;
  userId: number;
  userName: string;
  thumbnail: string;
  content: string;
  imageUrls: string[] | null;
  hashtags: string | null;
  likeYn: boolean;
  likesCount: number;
  commentCount: number;
  created: string;
  customCursor?: string;
}

export interface FeedComment {
  commentId: number;
  userId: number;
  userName: string;
  content: string;
  created: string;
  thumbnail: string;
}

export interface Reply {
  commentId: number;
  userId: number;
  userName: string;
  content: string;
  created: string;
  updated: string;
  thumbnail: string;
}

export interface Report {
  userId: number;
  reason: string;
}
export interface ClubRole {
  clubId: number;
  userId: number;
  role?: "MASTER" | "MANAGER" | "MEMBER" | "PENDING";
  applyStatus?: "APPLIED" | "APPROVED";
}

export interface LoginResponse extends BaseResponse {
  token: string;
}

export interface CategoryResponse extends BaseResponse {
  data: Category[];
}

export interface ClubResponse extends BaseResponse {
  data: Club;
}

export interface MyClubsResponse extends BaseResponse {
  data: MyClub[];
}

export interface ClubUpdateResponse extends BaseResponse {
  data: Club;
}

export interface ClubsResponse extends BaseResponse {
  hasNext: boolean;
  responses: {
    content: Club[];
  };
  size: number;
}

export interface ClubNotificationsResponse extends BaseResponse {
  data: Notification[];
}

export interface FeedResponse extends BaseResponse {
  data: Feed;
}

export interface FeedsResponse extends BaseResponse {
  hasNext: boolean;
  responses: {
    content: Feed[];
  };
  size: number;
}

export interface FeedCommentsResponse extends BaseResponse {
  data: FeedComment[];
}

export interface FeedsLikeReponse extends BaseResponse {
  data: Feed[];
}
export interface UserInfoResponse extends BaseResponse {
  data: User;
}
export interface BlockUserListResponse extends BaseResponse {
  data: BlockUser[];
}
export interface ReplyReponse extends BaseResponse {
  data: Reply[];
}
export interface ReportResponse extends BaseResponse {
  data: Report[];
}
export interface ClubsParams {
  token: string | null;
  categoryId: number | null;
  minMember: number | null;
  maxMember: number | null;
  showRecruiting: number;
  sortType: string;
  orderBy: string;
  showMy: number;
}

export interface ReplyParams {
  id: number;
  token: string | null;
}
export interface ClubSchedulesResponse extends BaseResponse {
  data: Schedule[];
}

export interface ClubRoleResponse extends BaseResponse {
  data: ClubRole;
}
export interface ClubCreationData {
  category1Id: number;
  category2Id?: number | null;
  isApproveRequired: string;
  clubShortDesc: string;
  clubLongDesc: string | null;
  clubName: string;
  clubMaxMember: number;
  contactPhone: string;
  organizationName: string;
}

export interface ImageType {
  uri: string;
  type: string;
  name?: string;
}

export interface ClubCreationRequest {
  image?: ImageType | null;
  data: ClubCreationData;
  token: string | null;
}
export interface ClubDeletionRequest {
  clubId: number;
}

export interface FeedCreationRequest {
  image?: ImageType[] | null;
  data: {
    userId?: number;
    content?: string;
  };
  token: string | null;
}

export interface FeedUpdateRequest {
  image?: ImageType[] | null;
  data: {
    id: number | undefined;
    // access: string
    content: string;
  };
  token: string | null;
}

export interface FeedReportRequest {
  feedId: number;
  reason: string;
}

export interface ClubUpdateRequest {
  image?: ImageType;
  data?: {
    clubName?: string;
    clubMaxMember?: number;
    isApproveRequired?: string;
    clubShortDesc?: string;
    clubLongDesc?: string | null;
    contactPhone?: string | null;
    recruitStatus?: string | null;
    category1Id?: number;
    category2Id?: number;
  };
  token: string | null;
  clubId: number;
}

export interface ClubWithdrawRequest {
  clubId: number;
}

export interface ClubScheduleCreationRequest {
  clubId: number;
  content: string;
  location: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface ClubScheduleUpdateRequest {
  clubId: number;
  scheduleId: number;
  body: {
    content: string;
    location: string;
    name: string;
    startDate: string;
    endDate: string;
  };
}

export interface ClubScheduleDeletionRequest {
  clubId: number;
  scheduleId: number;
}

export interface ClubScheduleJoinOrCancelRequest {
  clubId: number;
  scheduleId: number;
}

export interface ClubApplyRequest {
  clubId: number;
  memo: string;
}

export interface ClubApproveRequest {
  clubId: number;
  actionId: number;
  userId: number;
  token: string | null;
}

export interface ClubRejectRequest {
  clubId: number;
  actionId: number;
  userId: number;
}

export interface ChangeRoleRequest {
  clubId: number;
  data: ChangeRole[];
  token: string | null;
}

export interface ChangeRole {
  role: string | null;
  userId: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface FindIdRequest {
  phoneNumber?: string;
  username?: string;
}

export interface FindPwRequest {
  birthday?: string;
  email?: string;
  phoneNumber?: string;
  username?: string;
}

export interface UserInfoRequest {
  token: string | null;
  image?: {
    uri: string;
    type: string;
    name: string | undefined;
  } | null;
  data: {
    birthday?: string;
    name?: string;
    organizationName?: string;
    thumbnail?: string;
    sex?: string;
    phoneNumber?: string;
    interests?: [];
  };
}

export interface UserUpdateRequest {
  image?: ImageType | null;
  data?: {
    birthday?: string;
    name?: string;
    organizationName?: string;
    sex?: string;
    phoneNumber?: string;
  };
  token: string | null;
}

export interface SignUp {
  birthday?: string;
  email?: string;
  name?: string;
  password?: string;
  organizationName?: string;
  sex?: string;
  phoneNumber?: string;
}

export interface PasswordChangeRequest {
  password: string;
}

export interface UserBlockRequest {
  userId: number;
}

export interface UserPushAlarmRequest {
  alarmType: "USER" | "CLUB";
  isOnOff: "Y" | "N";
}

export interface TargetTokenUpdateRequest {
  targetToken: string;
}

export interface SuggestionSubmitRequest {
  content: string;
}

export interface FeedLikeRequest {
  feedId: number;
}

export interface FeedCommentCreationRequest {
  feedId: number;
  content: string;
}

export interface FeedCommentDeletionRequest {
  commentId: number;
}

export interface FeedDeletionRequest {
  feedId: number;
}

// Categories
const getCategories = ({ queryKey }: any) => axios.get<string, CategoryResponse>(`/api/categories`);

const getClub = ({ queryKey }: any) => {
  const [_key, clubId]: [string, number] = queryKey;
  return axios.get<string, ClubResponse>(`/api/clubs/${clubId}`);
};

const getClubs = ({ queryKey, pageParam }: any) => {
  const [_key, clubsParams]: [string, ClubsParams] = queryKey;
  let params = `categoryId=${clubsParams.categoryId ?? 0}&showMy=${clubsParams.showMy}&showRecruitingOnly=${clubsParams.showRecruiting}`;
  params += clubsParams.minMember !== null ? `&min=${clubsParams.minMember}` : "";
  params += clubsParams.maxMember !== null ? `&max=${clubsParams.maxMember}` : "";
  params += `&sort=${clubsParams.sortType}&orderBy=${clubsParams.orderBy}`;
  params += pageParam ? `&cursor=${pageParam}` : "";

  return axios.get<string, ClubsResponse>(`/api/clubs?${params}`);
};

const getClubRole = ({ queryKey }: any) => {
  const [_key, clubId]: [string, number] = queryKey;
  return axios.get<string, ClubRoleResponse>(`/api/clubs/${clubId}/role`);
};

const withdrawClub = async (req: ClubWithdrawRequest) => axios.post<string, BaseResponse>(`/api/clubs/${req.clubId}/withdraw`);
const applyClub = (req: ClubApplyRequest) => axios.post<string, BaseResponse>(`/api/clubs/apply`, req);

const getClubSchedules = ({ queryKey }: any) => {
  const [_key, clubId]: [string, number] = queryKey;
  return axios.get<string, ClubSchedulesResponse>(`/api/clubs/${clubId}/schedules`);
};

const getFeed = ({ queryKey }: any) => {
  const [_key, feedId]: [string, number] = queryKey;
  return axios.get<string, FeedResponse>(`/api/feeds/${feedId}`);
};

const getFeeds = ({ pageParam }: any) => {
  let params = pageParam ? `cursor=${pageParam}` : "";
  return axios.get<string, FeedsResponse>(`/api/feeds?${params}`);
};

const getClubFeeds = ({ queryKey, pageParam }: any) => {
  const [_key, clubId]: [string, number] = queryKey;
  let params = pageParam ? `cursor=${pageParam}` : "";
  return axios.get<string, FeedsResponse>(`/api/clubs/${clubId}/feeds?${params}`);
};

const createFeed = async (req: FeedCreationRequest) => {
  const body = new FormData();

  if (req.image) {
    for (let i = 0; i < req.image?.length; i++) body.append("file", req.image[i]);
  }

  body.append("feedCreateRequest", {
    string: JSON.stringify(req.data),
    type: "application/json",
  });
  return fetch(`${BASE_URL}/api/feeds`, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      authorization: `${req.token}`,
      Accept: "*/*",
    },
    body,
  }).then(async (res) => {
    if (res.status === 200) return { status: res.status, ...(await res.json()) };
    else return { status: res.status };
  });
};

const updateFeed = async (req: FeedUpdateRequest) => {
  return fetch(`${BASE_URL}/api/feeds/${req.data.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${req.token}`,
    },
    body: JSON.stringify(req.data),
  }).then(async (res) => {
    if (res.status === 200) return { status: res.status, ...(await res.json()) };
    else return { status: res.status };
  });
};

const createClub = async (req: ClubCreationRequest) => {
  const body = new FormData();

  if (req.image !== null) {
    body.append("file", req.image);
  }

  body.append("clubCreateRequest", {
    string: JSON.stringify(req.data),
    type: "application/json",
  });

  return fetch(`${BASE_URL}/api/clubs`, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      authorization: `${req.token}`,
      Accept: "*/*",
    },
    body,
  }).then(async (res) => {
    if (res.status === 200) return { status: res.status, ...(await res.json()) };
    else return { status: res.status };
  });
};

const deleteClub = async (req: ClubDeletionRequest) => axios.delete<string, BaseResponse>(`/api/clubs/${req.clubId}`);
const updateClub = async (req: ClubUpdateRequest) => {
  const body = new FormData();

  if (req.image) {
    body.append("file", req.image);
  }

  if (req.data) {
    body.append("clubUpdateRequest", {
      string: JSON.stringify(req.data),
      type: "application/json",
    });
  }

  return fetch(`${BASE_URL}/api/clubs/${req.clubId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data",
      authorization: `${req.token}`,
      Accept: "*/*",
    },
    body,
  }).then(async (res) => {
    return { status: res.status, ...(await res.json()) };
  });
};
const approveToClubJoin = (req: ClubApproveRequest) => axios.post<string, BaseResponse>(`/api/clubs/approve`, req);
const rejectToClubJoin = (req: ClubRejectRequest) => axios.post<string, BaseResponse>(`/api/clubs/reject`, req);
const getClubNotifications = ({ queryKey }: any) => {
  const [_key, clubId]: [string, number] = queryKey;
  return axios.get<string, ClubNotificationsResponse>(`/api/notifications/club/${clubId}`);
};

const changeRole = (req: ChangeRoleRequest) => axios.post<string, BaseResponse>(`/api/clubs/${req.clubId}/changeRole`, req.data);

// Club Schedule API
const createClubSchedule = (req: ClubScheduleCreationRequest) => axios.post<string, BaseResponse>(`/api/clubs/schedules`, req);
const updateClubSchedule = (req: ClubScheduleUpdateRequest) => axios.put<string, BaseResponse>(`api/clubs/${req.clubId}/schedules/${req.scheduleId}`, req.body);
const deleteClubSchedule = (req: ClubScheduleDeletionRequest) => axios.delete<string, BaseResponse>(`api/clubs/${req.clubId}/schedules/${req.scheduleId}`);
const joinOrCancelClubSchedule = (req: ClubScheduleJoinOrCancelRequest) => axios.post<string, BaseResponse>(`/api/clubs/${req.clubId}/schedules/${req.scheduleId}/joinOrCancel`);

// Profile API
const getUserInfo = ({ queryKey }: any) => axios.get<string, UserInfoResponse>(`/api/user`);
const updateUserInfo = (req: UserInfoRequest) => {
  const body = new FormData();

  if (req.image) {
    body.append("file", req.image);
  }

  if (req.data) {
    body.append("userUpdateRequest", {
      string: JSON.stringify(req.data),
      type: "application/json",
    });
  }

  return fetch(`${BASE_URL}/api/user`, {
    method: "PUT",
    headers: {
      "content-type": "multipart/form-data",
      authorization: `${req.token}`,
      Accept: "*/*",
    },
    body,
  }).then(async (res) => {
    if (res.status === 200) return { status: res.status, ...(await res.json()) };
    else return { status: res.status };
  });
};

const changePassword = (req: PasswordChangeRequest) => axios.post<string, BaseResponse>(`/api/user/changePassword`, req);
// User Block
const blockUser = (req: UserBlockRequest) => axios.post<string, BaseResponse>(`/api/user/block`, req);
const getBlockUserList = ({ queryKey }: any) => axios.get<string, BlockUserListResponse>(`/api/user/blockUserList`);

// Account Setting
const setPushAlarm = (req: UserPushAlarmRequest) => axios.put<string, BaseResponse>(`/api/user/pushAlarm`, req);
const withdrawAccount = () => axios.post<string, BaseResponse>(`/api/user/withdraw`);
const getMyClubs = ({ queryKey }: any) => axios.get<string, MyClubsResponse>(`/api/clubs/my`);
const submitSuggestion = (req: SuggestionSubmitRequest) => axios.post<string, BaseResponse>(`/api/user/suggestion`, req);

// FCM
const updateTargetToken = (req: TargetTokenUpdateRequest) => axios.post<string, BaseResponse>(`/api/user/updateTargetToken`, req);

// Feed Option
const reportFeed = (req: FeedReportRequest) => axios.put<string, BaseResponse>(`/api/feeds/${req.feedId}/report?reason=${req.reason}`);
const likeFeed = (req: FeedLikeRequest) => axios.post<string, BaseResponse>(`/api/feeds/${req.feedId}`);
const deleteFeed = (req: FeedDeletionRequest) => axios.delete<string, BaseResponse>(`/api/feeds/${req.feedId}`);

// Feed Comment
const getFeedComments = ({ queryKey }: any) => {
  const [_key, feedId]: [string, string, number] = queryKey;
  return axios.get<string, FeedCommentsResponse>(`/api/feeds/${feedId}/comments`);
};
const createFeedComment = (req: FeedCommentCreationRequest) => axios.post<string, BaseResponse>(`/api/feeds/${req.feedId}/comment`, req);
const deleteFeedComment = (req: FeedCommentDeletionRequest) => axios.delete<string, BaseResponse>(`/api/comments/${req.commentId}`);

// Login
const login = (req: LoginRequest) => {
  return fetch(`${BASE_URL}/api/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify(req),
  }).then(async (res) => {
    if (res.status === 200) return { status: res.status, ...(await res.json()) };
    else return { status: res.status };
  });
};

// Sign Up
const registerUserInfo = (req: SignUp) => {
  return fetch(`${BASE_URL}/api/user/signup`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(req),
  }).then(async (res) => {
    if (res.status === 200) return { status: res.status, ...(await res.json()) };
    else return { status: res.status };
  });
};

const FindUserId = (req: FindIdRequest) => {
  return fetch(`${BASE_URL}/api/user/findId`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(req),
  }).then(async (res) => {
    if (res.status === 200) return { status: res.status, ...(await res.json()) };
    else return { status: res.status };
  });
};

const FindUserPw = (req: FindPwRequest) => {
  return fetch(`${BASE_URL}/api/mail/findPw`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(req),
  }).then(async (res) => {
    if (res.status === 200) return { status: res.status, ...(await res.json()) };
    else return { status: res.status };
  });
};

export const ClubApi = {
  getCategories,
  getClub,
  getClubs,
  createClub,
  deleteClub,
  updateClub,
  withdrawClub,
  changeRole,
  getClubSchedules,
  createClubSchedule,
  updateClubSchedule,
  deleteClubSchedule,
  joinOrCancelClubSchedule,
  getClubRole,
  applyClub,
  getClubNotifications,
  approveToClubJoin,
  rejectToClubJoin,
};

export const UserApi = {
  getCategories,
  getUserInfo,
  registerUserInfo,
  updateUserInfo,
  getMyClubs,
  FindUserId,
  FindUserPw,
  changePassword,
  withdrawAccount,
  blockUser,
  getBlockUserList,
  setPushAlarm,
  updateTargetToken,
  submitSuggestion,
};

export const FeedApi = {
  getFeed,
  getFeeds,
  getClubFeeds,
  getFeedComments,
  createFeedComment,
  deleteFeedComment,
  createFeed,
  deleteFeed,
  reportFeed,
  updateFeed,
  likeFeed,
};

export const CommonApi = { login };
