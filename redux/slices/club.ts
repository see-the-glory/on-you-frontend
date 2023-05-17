import { createSlice } from "@reduxjs/toolkit";
import { ClubRole, Feed } from "../../api";

interface ClubState {
  feeds: Feed[];
  role?: "MASTER" | "MANAGER" | "MEMBER" | "PENDING" | null;
  applyStatus?: "APPLIED" | "APPROVED" | null;
}

const initialState: ClubState = {
  feeds: [],
  role: null,
  applyStatus: null,
};

const clubSlice = createSlice({
  name: "club",
  initialState,
  reducers: {
    deleteClub(state) {
      state.feeds = [];
      state.role = null;
      state.applyStatus = null;
    },
    refreshFeed(state, action) {
      state.feeds = [].concat(action.payload);
    },
    addFeed(state, action) {
      state.feeds = state.feeds.concat(action.payload);
    },
    likeToggle(state, action) {
      if (state.feeds[action.payload].likeYn) state.feeds[action.payload].likesCount--;
      else state.feeds[action.payload].likesCount++;
      state.feeds[action.payload].likeYn = !state.feeds[action.payload].likeYn;
    },
    updateCommentCount(state, action) {
      if (state.feeds.length > action.payload.feedIndex) {
        state.feeds[action.payload.feedIndex].commentCount = action.payload.count;
      }
    },
    updateClubRole(state, action) {
      state.role = action.payload.role;
      state.applyStatus = action.payload.applyStatus;
    },
  },
  // extraReducer는 비동기 액션 생성시 필요
  // extraReducers: builder => {},
});

export default clubSlice;
