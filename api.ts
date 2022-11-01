const BASE_URL = "http://3.39.190.23:8080";

interface BaseResponse {
  resultCode: string;
  transactionTime: string;
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
  name: string;
  clubShortDesc: string | null;
  clubLongDesc: string | null;
  announcement: string | null;
  organizationName: string;
  members: Member[];
  maxNumber: number;
  recruitNumber: number;
  thumbnail: string | null;
  recruitStatus: string | null;
  creatorName: string;
  created: string;
  categories: Category[];
  contactPhone: string | null;
  customCursor?: string;
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
  id: number;
  name: string;
  content: string;
  members: Member[];
  location: string;
  startDate: string;
  endDate: string | null;
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
  id: number | undefined;
  clubId: number;
  clubName: string;
  userId: number;
  userName: string;
  content: string;
  imageUrls: string[] | null;
  hashtags: string | null;
  likeYn: boolean;
  likesCount: number;
  commentCount: number;
  created: string;
}

export interface Reply {
  id:number;
  userId: number;
  userName: string;
  content: string;
  created: string;
  updated: string;
  thumbnail: string;
}

export interface Report{
  userId: number;
  reason: string;
}
export interface ClubRole {
  clubId: number;
  userId: number;
  role: "MASTER" | "MANAGER" | "MEMBER" | undefined;
  applyStatus: "APPLIED" | "APPROVED" | undefined;
}

export interface CategoryResponse extends BaseResponse {
  data: Category[];
}

export interface ClubResponse extends BaseResponse {
  data: Club;
  status: number;
}

export interface ClubUpdateResponse extends BaseResponse {
  data: Club;
  status: number;
}

export interface ClubsResponse extends BaseResponse {
  hasNext: boolean;
  responses: {
    content: Club[];
  };
  size: number;
}

export interface FeedsResponse extends BaseResponse {
  hasNext: boolean;
  data: Feed[];
  responses: {
    content: Feed[];
  };
}
export interface ModifiedReponse extends BaseResponse{
  data: Feed;
}
export interface FeedsLikeReponse extends BaseResponse{
  data:Feed[]
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
  id:number;
  token: string;
}

export interface ClubsParams {
  token: string;
  categoryId: number | null;
  minMember: number | null;
  maxMember: number | null;
  showRecruiting: number;
  sortType: string;
  orderBy: string;
  showMy: number;
}

export interface ReplyParams{
  id:number;
  token: string;
}
export interface ClubSchedulesResponse extends BaseResponse {
  data: Schedule[];
}

export interface ClubRoleResponse extends BaseResponse {
  data: ClubRole;
}
export interface ClubCreationRequest {
  image?: {
    uri: string;
    type: string;
    name: string | undefined;
  } | null;
  data: {
    category1Id: number;
    category2Id: number | null;
    isApproveRequired: string;
    clubShortDesc: string;
    clubLongDesc: string | null;
    clubName: string;
    clubMaxMember: number;
    phoneNumber: string;
    organizationName: string;
  };
  token: string;
}

export interface FeedCreationRequest {
  image?: {
    uri: string;
    type: string;
    name: string | undefined;
  }|null;
  data: {
    userId?: number;
    content?: string;
  };
  token: string;
}

export interface FeedUpdateRequest{
  data: {
    id: number | undefined;
    content: string;
  };
  token: string;
}
export interface FeedLikeRequest{
  data:{
    id?:number,
    userId?: number,
  };
  token: string;
}

export interface FeedReverseLikeRequest{
  data:{
    id:number,
    userId: number
  };
  token: string;
}

export interface FeedReportRequest{
  data:{
    id:number | undefined,
    userId:number,
    reason: string,
  };
  token: string;
}


export interface ClubUpdateRequest {
  image?: {
    uri: string;
    type: string;
    name: string | undefined;
  };
  data?: {
    clubName?: string;
    clubMaxMember?: number;
    isApproveRequired?: string;
    clubShortDesc?: string;
    clubLongDesc?: string | null;
    contactPhone?: string | null;
  };
  token: string;
  clubId: number;
}

export interface ClubScheduleCreationRequest {
  token: string;
  body: {
    clubId: number;
    content: string;
    location: string;
    name: string;
    startDate: string;
    endDate: string;
  };
}

export interface ClubApplyRequest {
  clubId: number;
  memo: string;
  token: string;
}

export interface ChangeRoleRequest {
  clubId: number;
  data: ChangeRole[];
  token: string;
}

export interface ChangeRole {
  role: string | null;
  userId: number;
}

export interface LoginRequest {
  token: string;
}

export interface UserInfoRequest {
  token: string;
  image: {
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

export interface SignUp {
  birthday?: string;
  email?: string;
  name?: string;
  password?: string;
  organizationName?: string;
  sex?: string;
  phoneNumber?: string;
}

export interface getReplyRequest{
  id: number;
  token:string;
}

export interface FeedReplyRequest{
  data: {
    id?: number;
    content?: string;
  }
  token: string;
}
// Categories
const getCategories = () => fetch(`${BASE_URL}/api/categories`).then((res) => res.json());

/**피드호출*/
const getFeeds = ({ queryKey }: any) => {
  const [_key, feedsParams]: [string, FeedsParams] = queryKey;
  return fetch(`${BASE_URL}/api/feeds`, {
    headers: {
      authorization: `${feedsParams.token}`,
    },
  }).then(async (res) => {
    if(res.status === 200) return {status: res.status, ...(await res.json())}
    else return {status: res.status}
  });
};

/**피드 선택*/
const getSelectFeeds = ({ queryKey }: any) => {
  const [_key, token, id]: [string, string, number] = queryKey;
return fetch(`${BASE_URL}/api/feeds/${id}`, {
  method: "GET",
  headers: {
      authorization: `${token}`
    }
  }).then(async (res) => {
  if(res.status === 200) return {status: res.status, ...(await res.json())}
  else return {status: res.status}
});
};

const getClubs = ({ queryKey, pageParam }: any) => {
  const [_key, clubsParams]: [string, ClubsParams] = queryKey;
  let parameters = `categoryId=${clubsParams.categoryId ?? 0}&showMy=${clubsParams.showMy}&showRecruitingOnly=${clubsParams.showRecruiting}`;
  parameters += clubsParams.minMember !== null ? `&min=${clubsParams.minMember}` : "";
  parameters += clubsParams.maxMember !== null ? `&max=${clubsParams.maxMember}` : "";
  parameters += `&sort=${clubsParams.sortType}&orderBy=${clubsParams.orderBy}`;
  parameters += pageParam ? `&cursor=${pageParam}` : "";
  console.log(parameters);
  return fetch(`${BASE_URL}/api/clubs?${parameters}`, {
    headers: {
      authorization: `${clubsParams.token}`,
    },
  }).then((res) => res.json());
};

const getClub = ({ queryKey }: any) => {
  const [_key, token, clubId]: [string, string, number] = queryKey;
  console.log(_key, token, clubId);
  return fetch(`${BASE_URL}/api/clubs/${clubId}`, {
    headers: {
      authorization: `${token}`,
    },
  }).then(async (res) => {
    return { status: res.status, ...(await res.json()) };
  });
};

const getClubRole = ({ queryKey }: any) => {
  const [_key, token, clubId]: [string, string, number] = queryKey;
  return fetch(`${BASE_URL}/api/clubs/${clubId}/role`, {
    headers: {
      authorization: `${token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.resultCode !== "OK") new Error("API Response Error.");
      else {
        res.data.applyStatus = res.data.applyStatus ?? undefined;
        res.data.role = res.data.role ?? undefined;
      }
      return res;
    });
};

const createFeed = async (req: FeedCreationRequest) => {
  const body = new FormData();

  if (req.image !== null) {
    body.append("file", req.image);
  }

  body.append("feedCreateRequest", {
    string: JSON.stringify(req.data),
    type: "application/json",
  });

  return fetch(`${BASE_URL}/api/feeds`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
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
  const body = new FormData();

  if (req.data) {
    body.append("feedUpdateRequest", {
      string: JSON.stringify(req.data),
      type: "application/json",
    });
  }

  return fetch(`${BASE_URL}/api/feeds/${req.data.id}`, {
    method: "PUT",
    headers: {
      "content-type": "multipart/form-data",
      authorization: `${req.token}`,
      Accept: "*/*",
    },
    body,
  }).then(async (res) => {
    if(res.status === 200) return {status: res.status, ...(await res.json())}
    else return {status: res.status}
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
      "content-type": "multipart/form-data",
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
      "content-type": "application/json",
      authorization: `${req.token}`,
    },
    body: JSON.stringify({ clubId: req.clubId, memo: req.memo }),
  }).then(async (res) => {
    return { ...(await res.json()), status: res.status };
  });
};

const changeRole = (req: ChangeRoleRequest) => {
  console.log(req);
  return fetch(`${BASE_URL}/api/clubs/${req.clubId}/changeRole`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `${req.token}`,
    },
    body: JSON.stringify(req.data),
  }).then(async (res) => {
    return { ...(await res.json()), status: res.status };
  });
};

const getClubSchedules = ({ queryKey }: any) => {
  const [_key, clubId]: [string, number] = queryKey;
  return fetch(`${BASE_URL}/api/clubs/${clubId}/schedules`).then((res) => res.json());
};

const createClubSchedule = async (req: ClubScheduleCreationRequest) => {
  return fetch(`${BASE_URL}/api/clubs/schedules`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `${req.token}`,
      Accept: "*/*",
    },
    body: JSON.stringify(req.body),
  }).then(async (res) => {
    return { status: res.status, json: await res.json() };
  });
};

const getJWT = (req: LoginRequest) => {
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
  }).then((response) => response.json());
};

const updateUserInfo = (req: UserInfoRequest) => {
  const body = new FormData();

  if (req.image !== null) {
    body.append("file", req.image);
  }

  body.append("UserInfoRequest", {
    string: JSON.stringify(req.data),
    type: "application/json",
  });

  return fetch(`${BASE_URL}/api/user`, {
    method: "PUT",
    headers: {
      "content-type": "multipart/form-data",
      authorization: `${req.token}`,
      Accept: "*/*",
    },
    body,
  }).then(async (res) => {
    return { status: res.status, json: await res.json() };
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
    return { ...(await res.json()), status: res.status };
  });
};

const selectMyClubs = ({ queryKey }: any) => {
  const [_key, token]: [string, string] = queryKey;
  return fetch(`${BASE_URL}/api/clubs/my`, {
    method: "GET",
    headers: {
      authorization: `${token}`,
    },
  }).then((res) => res.json());
};

/**피드신고*/
const reportFeed = (req: FeedReportRequest) => {
  console.log(req.data.id)
  console.log(req.data.reason)
  return fetch(`${BASE_URL}/api/feeds/${req.data.id}/report?reason=${req.data.reason}`, {
    method: "PUT",
    headers: {
      Authorization: `${req.token}`,
    },
  }).then(async (res) => {
    if(res.status === 200) return {status: res.status, ...(await res.json())}
    else return {status: res.status}
  });
};

/**피드좋아요*/
const likeCount = ({mutationkey}:any) =>{
  const [id, token]: [number, string] = mutationkey;
  console.log(id)
  return fetch(`${BASE_URL}/api/feeds/${id}/likes`, {
    method: "POST",
    headers: {
      Authorization: `${token}`,
    },
  }).then(async (res) => {
    if(res.status === 200) return {status: res.status, ...(await res.json())}
    else return {status: res.status}
  });
}

/**피드 좋아요 취소*/
const likeCountReverse = ({mutationkey}:any) => {
  const [id, token]: [number, string] = mutationkey;
  return fetch(`${BASE_URL}/api/feeds/${id}/likes`, {
    method: "PUT",
    headers: {
      Authorization: `${token}`,
    },
  }).then(async (res) => {
    if(res.status === 200) return {status: res.status, ...(await res.json())}
    else return {status: res.status}
  });
}

/**댓글호출*/
const getReply = ({queryKey}:any) => {
  const [_key, token, id]: [string, string, number] = queryKey;
  return fetch(`${BASE_URL}/api/feeds/${id}/comments`, {
    method: "GET",
    headers: {
      Authorization: `${token}`,
    },
  }) .then((res) => res.json())
    .then((res) => {
      if (res.resultCode !== "OK") new Error("API Response Error.");
      else {
        res.data.applyStatus = res.data.applyStatus ?? undefined;
        res.data.role = res.data.role ?? undefined;
      }
      return res;
    });
};

/**댓글달기*/
const ReplyFeed = (req:FeedReplyRequest) =>{
  return fetch(`${BASE_URL}/api/feeds/${req.data.id}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${req.token}`,
    },
    body: JSON.stringify(req.data),
  }).then(async (res) => {
    if(res.status === 200) return {status: res.status, ...(await res.json())}
    else return {status: res.status}
  });
}

export const ClubApi = {
  getCategories,
  getClub,
  getClubs,
  createClub,
  updateClub,
  changeRole,
  getClubSchedules,
  createClubSchedule,
  getClubRole,
  applyClub,
  selectMyClubs,
};

export const UserApi = {
  getCategories,
  getUserInfo,
  registerUserInfo,
  updateUserInfo,
  selectMyClubs,
};

export const FeedApi = {
  getFeeds,
  createFeed,
  reportFeed,
  updateFeed,
  likeCount,
  likeCountReverse,
  getReply,
  ReplyFeed,
  getSelectFeeds,
};

export const CommonApi = { getJWT };



