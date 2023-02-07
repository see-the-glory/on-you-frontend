import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Feed } from "../../api";

interface FeedState {
  data: Feed[];
}

const initialState: FeedState = {
  data: [],
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    init(state, action) {
      state.data = [].concat(action.payload);
    },
    addFeed(state, action) {
      state.data = state.data.concat(action.payload);
    },
    likeToggle(state, action) {
      if (state.data[action.payload].likeYn) state.data[action.payload].likesCount--;
      else state.data[action.payload].likesCount++;
      state.data[action.payload].likeYn = !state.data[action.payload].likeYn;
    },
    updateCommentCount(state, action) {
      if (state.data.length > action.payload.feedIndex) {
        state.data[action.payload.feedIndex].commentCount = action.payload.count;
      }
    },
  },
  // extraReducer는 비동기 액션 생성시 필요
  // extraReducers: builder => {},
});

export default feedSlice;
