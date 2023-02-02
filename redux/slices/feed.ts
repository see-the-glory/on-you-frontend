import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  data: {},
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {},
  // extraReducer는 비동기 액션 생성시 필요
  // extraReducers: builder => {},
});

export default feedSlice;
