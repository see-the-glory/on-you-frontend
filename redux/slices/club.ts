import { createSlice } from "@reduxjs/toolkit";
import { ClubRole, Feed } from "../../api";

interface ClubData {
  feeds: Feed[];
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
        feeds: [],
        role: null,
        applyStatus: null,
      };
    },
    refreshFeed(state, action) {
      state[action.payload.clubId].feeds = [...action.payload.feeds];
    },
    addFeed(state, action) {
      const { clubId, feeds } = action.payload;
      state[clubId].feeds = [...state[clubId]?.feeds, ...feeds];
    },
    likeToggle(state, action) {
      const { clubId, feedIndex } = action.payload;
      if (state[clubId].feeds[feedIndex].likeYn) state[clubId].feeds[feedIndex].likesCount--;
      else state[clubId].feeds[feedIndex].likesCount++;
      state[clubId].feeds[feedIndex].likeYn = !state[clubId].feeds[feedIndex].likeYn;
    },
    updateCommentCount(state, action) {
      const { clubId, feedIndex, count } = action.payload;
      if (state[clubId].feeds.length > feedIndex) state[clubId].feeds[feedIndex].commentCount = count;
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
