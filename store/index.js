import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import AuthReducers from "./reducers";
const RootReducers = combineReducers({
  // reducers
  AuthReducers,
});

export const store = createStore(RootReducers, applyMiddleware(thunk));
