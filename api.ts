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
  applyStatus?: string | null;
  creatorName: string;
  category1Name: string;
  category2Name: string | null;
}

export interface Member {
  birthday: string;
  created: string;
  email: string;
  id: number;
  name: string;
  organization: string;
  sex: string;
  role: string | null;
  thumbnail: string | null;
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
}
export interface Feed {
  feedId: number;
  clubId: number;
  clubName: string;
  userId: number;
  userName: string;
  content: string;
  imageUrls: string | null;
  hashtags: string | null;
  likeYn: boolean;
  likesCount: number;
  commentCount: number;
}

export interface Reply {
  userId: number;
  userName: string;
  content: string;
  created: string;
  updated: string;
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
  data: {
    values: Club;
  };
}

export interface ClubsResponse extends BaseResponse {
  data: {
    values: Club[];
    hasNext: boolean;
  };
}

export interface FeedsResponse extends BaseResponse {
  data: Feed[];
}

export interface UserInfoResponse extends BaseResponse {
  data: User;
}
export interface ReplyReponse extends BaseResponse {
  data: Reply[];
}

export interface ClubsParams {
  categoryId: number | null;
  clubState: number | null;
  minMember: number | null;
  maxMember: number | null;
  sort: string | null;
}

export interface ClubSchedulesResponse extends BaseResponse {
  data: Schedule[];
}

export interface ClubRoleResponse extends BaseResponse {
  data: ClubRole;
}

export interface ClubCreationRequest {
  image: {
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
  };
  token: string;
}

export interface ClubApplyRequest {
  clubId: number;
  memo: string;
  token: string;
}

export interface LoginRequest {
  token: string;
}

export interface UserInfoRequest {
  token: string;
  data: {
    birthday?: string;
    name?: string;
    organizationName?: string;
    thumbnail?: string;
  };
}

const getCategories = () => fetch(`${BASE_URL}/api/categories`).then((res) => res.json());

const getClubs = ({ queryKey, pageParam }: any) => {
  const [_key, clubsParams]: [string, ClubsParams] = queryKey;
  return fetch(`${BASE_URL}/api/clubs?category1Id=${clubsParams.categoryId ? clubsParams.categoryId : ""}&cursorId=${pageParam ? pageParam : ""}`).then((res) => res.json());
};

const getClub = ({ queryKey }: any) => {
  const [_key, clubId]: [string, number] = queryKey;
  return fetch(`${BASE_URL}/api/clubs/${clubId}`).then((res) => res.json());
};

const getClubSchedules = ({ queryKey }: any) => {
  const [_key, clubId]: [string, number] = queryKey;
  return fetch(`${BASE_URL}/api/clubs/${clubId}/schedules`).then((res) => res.json());
};

const getClubRole = ({ queryKey }: any) => {
  const [_key, token, clubId]: [string, string, number] = queryKey;
  return fetch(`${BASE_URL}/api/clubs/${clubId}/role`, {
    headers: {
      authorization: `Bearer ${token}`,
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
      authorization: `Bearer ${req.token}`,
      Accept: "*/*",
    },
    body,
  }).then(async (res) => {
    return { status: res.status, json: await res.json() };
  });
};

const applyClub = (req: ClubApplyRequest) => {
  return fetch(`${BASE_URL}/api/clubs/${req.clubId}/apply`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${req.token}`,
    },
    body: JSON.stringify({ memo: req.memo }),
  })
    .then((res) => {
      if (res.status === 409) console.log("[ERROR] API 409");
      return res.json();
    })
    .then((res) => {
      if (res.resultCode !== "OK") new Error("applyClub API Response Error");
      else return res;
    });
};

const getJWT = (req: LoginRequest) => {
  return fetch(`${BASE_URL}/login/kakao/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  }).then((res) => res.json());
};

const getUserInfo = ({ queryKey }: any) => {
  const [_key, token]: [string, string] = queryKey;
  return fetch(`${BASE_URL}/api/user`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  }).then((response) => response.json());
};

const updateUserInfo = (req: UserInfoRequest) => {
  return fetch(`${BASE_URL}/api/user`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${req.token}`,
    },
    body: JSON.stringify(req.data),
  }).then((res) => res.json());
};

const registerUserInfo = ({ queryKey }: any) => {
  const [_key, token]: [string, string] = queryKey;
  return fetch(`${BASE_URL}/api/user`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
    },
  }).then((response) => response.json());
};

const getFeeds = ({ queryKey }: any) => {
  const [_key, token]: [string, string] = queryKey;
  return fetch(`${BASE_URL}/api/feeds`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
};

export const ClubApi = {
  getCategories,
  getClub,
  getClubs,
  createClub,
  getClubSchedules,
  getClubRole,
  applyClub,
  getFeeds,
};
export const CommonApi = { getJWT };
