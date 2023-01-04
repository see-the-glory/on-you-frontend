import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { AuthReducers, UserReducers } from "./Reducers";
const RootReducers = combineReducers({
  // reducers
  AuthReducers,
  UserReducers,
});

export const store = createStore(RootReducers, applyMiddleware(thunk));
