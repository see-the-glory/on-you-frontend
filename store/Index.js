import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { AuthReducers, UserReducers, ClubReducers } from "./Reducers";
const RootReducers = combineReducers({
  // reducers
  AuthReducers,
  UserReducers,
  ClubReducers,
});

export const store = createStore(RootReducers, applyMiddleware(thunk));
