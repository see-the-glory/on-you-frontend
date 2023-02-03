const BASE_URL = "http://3.39.190.23:8080";

interface BaseResponse {
  resultCode: string;
  transactionTime: string;
  status: number;
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

export interface MyClub {
  id: number;
  name: string;
  clubShotDesc: string;
  clubLongDesc: string;
  organizationName: string;
  categories?: Category[];
  thumbnail?: string | null;
  applyStatus?: "APPLIED" | "APPROVED";
  createrName: string;
  created?: string;
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

export interface CategoryResponse extends BaseResponse {
  data: Category[];
}

export interface ClubResponse extends BaseResponse {
  data: Club;
}

export interface MyClubResponse extends BaseResponse {
  data: MyClub;
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
  data: Notification;
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

export interface ModifiedReponse extends BaseResponse {
  data: Feed;
}
export interface FeedsLikeReponse extends BaseResponse {
  data: Feed[];
}
export interface UserInfoResponse extends BaseResponse {
  data: User;
}
export interface ReplyReponse extends BaseResponse {
  data: Reply[];
}
export interface ReportResponse extends BaseResponse {
  data: Report[];
}
export interface FeedsParams {
  clubId?: number;
  token: string | null;
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
  data: {
    id: number;
    reason: string;
  };
  token: string | null;
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

export interface ClubScheduleCreationRequest {
  token: string | null;
  body: {
    clubId: number;
    content: string;
    location: string;
    name: string;
    startDate: string;
    endDate: string;
  };
}

export interface ClubScheduleUpdateRequest {
  token: string | null;
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

export interface ClubScheduleDeleteRequest {
  token: string | null;
  clubId: number;
  scheduleId: number;
}

export interface ClubScheduleJoinOrCancelRequest {
  token: string | null;
  clubId: number;
  scheduleId: number;
}

export interface ClubApplyRequest {
  clubId: number;
  memo: string;
  token: string | null;
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
  token: string | null;
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

export interface PostChangePw {
  data: {
    password?: string;
  };
  token: string | null;
}

export interface FeedLikeRequest {
  data: {
    id: number;
  };
  token: string | null;
}

export interface FeedCommentCreationRequest {
  token: string | null;
  data: {
    id: number;
    content: string;
  };
}

export interface FeedCommentDeleteRequest {
  token: string | null;
  data: {
    id: number;
  };
}

export interface FeedDeleteRequest {
  data: {
    id: number;
  };
  token: string | null;
} // Categories
const getCategories = () => fetch(`${BASE_URL}/api/categories`).then((res) => res.json());

/**피드 선택*/
const getSelectFeeds = ({ queryKey }: any) => {
  const [_key, token, id]: [string, string, number] = queryKey;
  console.log(id + "id");
  return fetch(`${BASE_URL}/api/feeds/${id}`, {
    method: "GET",
    headers: {
      authorization: `${token}`,
    },
  }).then(async (res) => {
    if (res.status === 200) return { status: res.status, ...(await res.json()) };
    else return { status: res.status };
  });
};

const getFeeds = ({ queryKey, pageParam }: any) => {
  const [_key, feedsParams]: [string, FeedsParams] = queryKey;
  let parameters = feedsParams ? `cursor=${pageParam}` : "";
  console.log("feed parameter: ", parameters);
  return fetch(`${BASE_URL}/api/feeds?${parameters}`, {
    headers: {
      authorization: `${feedsParams.token}`,
    },
  }).then(async (res) => {
    return { ...(await res.json()), status: res.status };
  });
};

const getClubFeeds = ({ queryKey, pageParam }: any) => {
  const [_key, feedsParams]: [string, FeedsParams] = queryKey;
  let parameters = pageParam ? `cursor=${pageParam}` : "";
  console.log("feed parameter: ", parameters);
  return fetch(`${BASE_URL}/api/clubs/${feedsParams.clubId}/feeds?${parameters}`, {
    headers: {
      authorization: `${feedsParams.token}`,
    },
  }).then(async (res) => {
    return { ...(await res.json()), status: res.status };
  });
};

const getClubs = ({ queryKey, pageParam }: any) => {
  const [_key, clubsParams]: [string, ClubsParams] = queryKey;
  let parameters = `categoryId=${clubsParams.categoryId ?? 0}&showMy=${clubsParams.showMy}&showRecruitingOnly=${clubsParams.showRecruiting}`;
  parameters += clubsParams.minMember !== null ? `&min=${clubsParams.minMember}` : "";
  parameters += clubsParams.maxMember !== null ? `&max=${clubsParams.maxMember}` : "";
  parameters += `&sort=${clubsParams.sortType}&orderBy=${clubsParams.orderBy}`;
  parameters += pageParam ? `&cursor=${pageParam}` : "";
  console.log("club parameter: ", parameters);
  return fetch(`${BASE_URL}/api/clubs?${parameters}`, {
    headers: {
      authorization: `${clubsParams.token}`,
    },
  }).then(async (res) => {
    return { ...(await res.json()), status: res.status };
  });
};

const getClub = ({ queryKey }: any) => {
  const [_key, token, clubId]: [string, string, number] = queryKey;
  return fetch(`${BASE_URL}/api/clubs/${clubId}`, {
    headers: {
      authorization: `${token}`,
    },
  }).then(async (res) => {
    return { ...(await res.json()), status: res.status };
  });
};

const getClubRole = ({ queryKey }: any) => {
  const [_key, token, clubId]: [string, string, number] = queryKey;
  return fetch(`${BASE_URL}/api/clubs/${clubId}/role`, {
    headers: {
      authorization: `${token}`,
    },
  }).then(async (res) => {
    return { ...(await res.json()), status: res.status };
  });
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
  console.log(req.data.id + "realId");

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
    return { ...(await res.json()), status: res.status };
  });
};

const applyClub = (req: ClubApplyRequest) => {
  return fetch(`${BASE_URL}/api/clubs/apply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `${req.token}`,
    },
    body: JSON.stringify({ clubId: req.clubId, memo: req.memo }),
  }).then(async (res) => {
    return { ...(await res.json()), status: res.status };
  });
};

const approveToClubJoin = (req: ClubApproveRequest) => {
  return fetch(`${BASE_URL}/api/clubs/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `${req.token}`,
    },
    body: JSON.stringify({ clubId: req.clubId, actionId: req.actionId, userId: req.userId }),
  }).then(async (res) => {
    return { ...(await res.json()), status: res.status };
  });
};

const rejectToClubJoin = (req: ClubRejectRequest) => {
  return fetch(`${BASE_URL}/api/clubs/reject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `${req.token}`,
    },
    body: JSON.stringify({ clubId: req.clubId, actionId: req.actionId, userId: req.userId }),
  }).then(async (res) => {
    return { ...(await res.json()), status: res.status };
  });
};

const getClubNotifications = ({ queryKey }: any) => {
  const [_key, clubId]: [string, number] = queryKey;
  return fetch(`${BASE_URL}/api/notifications/club/${clubId}`).then(async (res) => {
    return { ...(await res.json()), status: res.status };
  });
};

const changeRole = (req: ChangeRoleRequest) => {
  console.log(req);
  return fetch(`${BASE_URL}/api/clubs/${req.clubId}/changeRole`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `${req.token}`,
    },
    body: JSON.stringify(req.data),
  }).then(async (res) => {
    return { ...(await res.json()), status: res.status };
  });
};

const getClubSchedules = ({ queryKey }: any) => {
  const [_key, clubId]: [string, number] = queryKey;
  return fetch(`${BASE_URL}/api/clubs/${clubId}/schedules`).then(async (res) => {
    return { ...(await res.json()), status: res.status };
  });
};

const createClubSchedule = (req: ClubScheduleCreationRequest) => {
  return fetch(`${BASE_URL}/api/clubs/schedules`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `${req.token}`,
      Accept: "*/*",
    },
    body: JSON.stringify(req.body),
  }).then(async (res) => {
    return { ...(await res.json()), status: res.status };
  });
};

const updateClubSchedule = (req: ClubScheduleUpdateRequest) => {
  return fetch(`${BASE_URL}/api/clubs/${req.clubId}/schedules/${req.scheduleId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `${req.token}`,
      Accept: "*/*",
    },
    body: JSON.stringify(req.body),
  }).then(async (res) => {
    return { ...(await res.json()), status: res.status };
  });
};

const deleteClubSchedule = (req: ClubScheduleDeleteRequest) => {
  console.log(req);
  return fetch(`${BASE_URL}/api/clubs/${req.clubId}/schedules/${req.scheduleId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `${req.token}`,
      Accept: "*/*",
    },
  }).then(async (res) => {
    return { ...(await res.json()), status: res.status };
  });
};

const joinOrCancelClubSchedule = (req: ClubScheduleJoinOrCancelRequest) => {
  return fetch(`${BASE_URL}/api/clubs/${req.clubId}/schedules/${req.scheduleId}/joinOrCancel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `${req.token}`,
      Accept: "*/*",
    },
  }).then(async (res) => {
    return { ...(await res.json()), status: res.status };
  });
};

const getUserToken = (req: LoginRequest) => {
  return fetch(`${BASE_URL}/api/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  }).then(async (res) => {
    return { ...(await res.json()), status: res.status };
  });
};

const getUserInfo = ({ queryKey }: any) => {
  const [_key, token]: [string, string] = queryKey;
  return fetch(`${BASE_URL}/api/user`, {
    method: "GET",
    headers: {
      authorization: `${token}`,
    },
  }).then(async (res) => {
    return { ...(await res.json()), status: res.status };
  });
};

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

const changePassword = (req: PostChangePw) => {
  return fetch(`${BASE_URL}/api/user/changePw`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `${req.token}`,
    },
    body: JSON.stringify(req.data),
  }).then(async (res) => {
    if (res.status === 200) return { status: res.status, ...(await res.json()) };
    else return { status: res.status };
  });
};

const selectMyClubs = ({ queryKey }: any) => {
  const [_key, token]: [string, string] = queryKey;
  return fetch(`${BASE_URL}/api/clubs/my`, {
    headers: {
      authorization: `${token}`,
    },
  }).then(async (res) => {
    return { status: res.status, ...(await res.json()) };
  });
};

/**피드신고*/
const reportFeed = (req: FeedReportRequest) => {
  return fetch(`${BASE_URL}/api/feeds/${req.data.id}/report?reason=${req.data.reason}`, {
    method: "PUT",
    headers: {
      Authorization: `${req.token}`,
    },
  }).then(async (res) => {
    if (res.status === 200) return { status: res.status, ...(await res.json()) };
    else return { status: res.status };
  });
};

/**피드좋아요*/
const likeFeed = (req: FeedLikeRequest) => {
  return fetch(`${BASE_URL}/api/feeds/${req.data.id}/likes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${req.token}`,
    },
  }).then(async (res) => {
    if (res.status === 200) return { status: res.status, ...(await res.json()) };
    else return { status: res.status };
  });
};

const getFeedComments = ({ queryKey }: any) => {
  const [_key, token, feedId]: [string, string, number] = queryKey;
  return fetch(`${BASE_URL}/api/feeds/${feedId}/comments`, {
    method: "GET",
    headers: {
      Authorization: `${token}`,
    },
  }).then(async (res) => {
    if (res.status === 200) return { status: res.status, ...(await res.json()) };
    else return { status: res.status };
  });
};

const createFeedComment = (req: FeedCommentCreationRequest) => {
  return fetch(`${BASE_URL}/api/feeds/${req.data.id}/comment`, {
    method: "POST",
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

const deleteFeedComment = (req: FeedCommentDeleteRequest) => {
  return fetch(`${BASE_URL}/api/comments/${req.data.id}`, {
    method: "DELETE",
    headers: {
      authorization: `${req.token}`,
    },
  }).then(async (res) => {
    if (res.status === 200) return { status: res.status, ...(await res.json()) };
    else return { status: res.status };
  });
};

const deleteFeed = (req: FeedDeleteRequest) => {
  return fetch(`${BASE_URL}/api/feeds/${req.data.id}`, {
    method: "DELETE",
    headers: {
      authorization: `${req.token}`,
    },
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
  updateClub,
  changeRole,
  getClubSchedules,
  createClubSchedule,
  updateClubSchedule,
  deleteClubSchedule,
  joinOrCancelClubSchedule,
  getClubRole,
  applyClub,
  selectMyClubs,
  getClubNotifications,
  approveToClubJoin,
  rejectToClubJoin,
};

export const UserApi = {
  getCategories,
  getUserInfo,
  registerUserInfo,
  updateUserInfo,
  selectMyClubs,
  FindUserId,
  FindUserPw,
  changePassword,
};

export const FeedApi = {
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
  getSelectFeeds,
};

export const CommonApi = { getUserToken };
