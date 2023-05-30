import { createSlice } from "@reduxjs/toolkit";
import { ClubRole, Feed } from "../../api";

interface ClubData {
  role?: "MASTER" | "MANAGER" | "MEMBER" | "PENDING" | null;
  applyStatus?: "APPLIED" | "APPROVED" | null;
}

interface ClubState {
  [index: number]: ClubData;
}

const initialState: ClubState = {};

const clubSlice = createSlice({
  name: "club",
  initialState,
  reducers: {
    initClub(state, action) {
      state[action.payload.clubId] = {
        role: null,
        applyStatus: null,
      };
    },
    updateClubRole(state, action) {
      const { clubId, role, applyStatus } = action.payload;
      state[clubId].role = role;
      state[clubId].applyStatus = applyStatus;
    },
  },
  // extraReducer는 비동기 액션 생성시 필요
  // extraReducers: builder => {},
});

export default clubSlice;
