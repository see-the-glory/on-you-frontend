import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Feed } from "../../api";

interface FeedData {
  likeYn: boolean;
  likesCount: number;
  commentCount: number;
}

interface FeedState {
  [index: number]: FeedData;
}

const initialState: FeedState = {};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    refreshFeed(state, action) {
      const feeds = action.payload.feeds;
      feeds.forEach((feed: Feed) => {
        const feedId = feed?.id;
        if (feedId !== undefined) {
          state[feedId] = {
            likeYn: feed?.likeYn ?? false,
            likesCount: feed?.likesCount ?? 0,
            commentCount: feed?.commentCount ?? 0,
          };
        }
      });
    },
    addFeeds(state, action) {
      const feeds = action.payload.feeds;
      feeds.forEach((feed: Feed) => {
        const feedId = feed?.id;
        if (feedId !== undefined) {
          state[feedId] = {
            likeYn: feed?.likeYn ?? false,
            likesCount: feed?.likesCount ?? 0,
            commentCount: feed?.commentCount ?? 0,
          };
        }
      });
    },
    addFeed(state, action) {
      const { feedId, feed }: { feedId: number; feed: Feed } = action.payload;
      if (feedId !== undefined) {
        state[feedId] = {
          likeYn: feed?.likeYn ?? false,
          likesCount: feed?.likesCount ?? 0,
          commentCount: feed?.commentCount ?? 0,
        };
      }
    },
    likeToggle(state, action) {
      const feedId = action.payload.feedId;
      if (state[feedId]?.likeYn) state[feedId].likesCount--;
      else state[feedId].likesCount++;
      state[feedId].likeYn = !state[feedId].likeYn;
    },
    deleteFeed(state) {
      state = {};
    },
    updateCommentCount(state, action) {
      state[action.payload.feedId].commentCount = action.payload.count;
    },
  },
  // extraReducer는 비동기 액션 생성시 필요
  // extraReducers: builder => {},
});

export default feedSlice;
