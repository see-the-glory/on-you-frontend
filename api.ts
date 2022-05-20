const BASE_URL = "http://52.78.5.27:8080/api";

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
  applyStatus: string | null;
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

export interface CategoryResponse extends BaseResponse {
  data: Category[];
}

export interface ClubsResponse extends BaseResponse {
  data: Club[];
}

const getCategories = () =>
  fetch(`${BASE_URL}/categories`).then((res) => res.json());

const getClubs = () => fetch(`${BASE_URL}/clubs`).then((res) => res.json());

export const clubApi = { getCategories, getClubs };
