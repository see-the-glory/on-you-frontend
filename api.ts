const BASE_URL = "http://3.39.190.23:8080/api";

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
}

export interface Schedule {
  id: number;
  name: string;
  content: string;
  location: string;
  startDate: string;
  endDate: string | null;
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
  data: Club[];
}

export interface ClubSchedulesResponse extends BaseResponse {
  data: Schedule[];
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
}

const getCategories = () =>
  fetch(`${BASE_URL}/categories`).then((res) => res.json());

const getClubs = () => fetch(`${BASE_URL}/clubs`).then((res) => res.json());

const getClub = ({ queryKey }) => {
  const [_key, clubId] = queryKey;
  return fetch(`${BASE_URL}/clubs/${clubId}`).then((res) => res.json());
};

const getClubSchedules = ({ queryKey }) => {
  const [_key, clubId] = queryKey;
  return fetch(`${BASE_URL}/clubs/${clubId}/schedules`).then((res) =>
    res.json()
  );
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

  return fetch(`${BASE_URL}/clubs`, {
    method: "POST",
    headers: {
      "content-type": "multipart/form-data",
      authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiLsnqXspIDsmqkiLCJzb2NpYWxJZCI6IjIxOTAwMzc4NTAiLCJpZCI6NCwiZXhwIjoxMDAwMDAxNjU0NjA3MDA4fQ.m8OBIZEcB5dZ339YvhnWgJIRatKoF-DVPk2RrbXirsQRnYdFaALwnjR4oNmHGE-OZDfhDfOITaYzWLqYnU2vcQ",
      Accept: "*/*",
    },
    body,
  }).then(async (res) => {
    return { status: res.status, json: await res.json() };
  });
};

export const ClubApi = {
  getCategories,
  getClub,
  getClubs,
  createClub,
  getClubSchedules,
};
