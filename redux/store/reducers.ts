import { combineReducers } from "redux";
import clubSlice from "../slices/club";
import feedSlice from "../slices/feed";
import authSlice from "../slices/auth";

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  club: clubSlice.reducer,
  feed: feedSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
