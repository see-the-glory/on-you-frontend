import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import AuthReducers from "./Reducers";
const RootReducers = combineReducers({
  // reducers
  AuthReducers,
});

export const store = createStore(RootReducers, applyMiddleware(thunk));
