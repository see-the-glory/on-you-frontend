import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  data: {},
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
      state.data = {};
      state.homeScrollY = 0;
      state.scheduleScrollX = 0;
    },
  },
  // extraReducer는 비동기 액션 생성시 필요
  // extraReducers: builder => {},
});

export default clubSlice;
