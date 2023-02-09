import { createSlice } from "@reduxjs/toolkit";
import { Feed } from "../../api";

interface ClubState {
  feeds: Feed[];
  homeScrollY: number;
  scheduleScrollX: number;
}

const initialState: ClubState = {
  feeds: [],
  homeScrollY: 0,
  scheduleScrollX: 0,
};

const clubSlice = createSlice({
  name: "club",
  initialState,
  reducers: {
    updateClubHomeScrollY(state, action) {
      state.homeScrollY = action.payload.scrollY;
    },
    updateClubHomeScheduleScrollX(state, action) {
      state.scheduleScrollX = action.payload.scrollX;
    },
    deleteClub(state) {
      state.feeds = [];
      state.homeScrollY = 0;
      state.scheduleScrollX = 0;
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
  },
  // extraReducer는 비동기 액션 생성시 필요
  // extraReducers: builder => {},
});

export default clubSlice;
