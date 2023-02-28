import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../../api";

interface AuthState {
  user: User | null;
  token: string | null;
  fcmToken: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  fcmToken: null,
};

export const init = createAsyncThunk("auth/init", async (payload, thunkAPI) => {
  let token = null;
  let fcmToken = null;
  let user = null;
  try {
    token = await AsyncStorage.getItem("token");
    fcmToken = await AsyncStorage.getItem("fcmToken");
    user = await AsyncStorage.getItem("user");
    if (user) user = JSON.parse(user);
    else user = "";
  } catch (err) {
    console.log(err);
    return thunkAPI.rejectWithValue(payload);
  }
  return thunkAPI.fulfillWithValue({ user, token, fcmToken });
});

export const login = createAsyncThunk("auth/login", async (payload: { token: string }, thunkAPI) => {
  try {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.setItem("token", payload.token);
  } catch (err) {
    console.log(err);
    return thunkAPI.rejectWithValue(payload);
  }
  return thunkAPI.fulfillWithValue(payload);
});

export const logout = createAsyncThunk("auth/logout", async (payload, thunkAPI) => {
  try {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("fcmToken");
  } catch (err) {
    console.log(err);
    return thunkAPI.rejectWithValue(payload);
  }
  return thunkAPI.fulfillWithValue(payload);
});

export const updateUser = createAsyncThunk("auth/updateUser", async (payload: { user: User }, thunkAPI) => {
  try {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.setItem("user", JSON.stringify(payload.user));
  } catch (err) {
    console.log(err);
    return thunkAPI.rejectWithValue(payload);
  }
  return thunkAPI.fulfillWithValue(payload);
});

export const updateFCMToken = createAsyncThunk("auth/updateFCMToken", async (payload: { fcmToken: string | null }, thunkAPI) => {
  try {
    await AsyncStorage.removeItem("fcmToken");
    if (payload.fcmToken) await AsyncStorage.setItem("fcmToken", payload.fcmToken);
  } catch (err) {
    console.log(err);
    return thunkAPI.rejectWithValue(payload);
  }
  return thunkAPI.fulfillWithValue(payload);
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  // extraReducer는 비동기 액션 생성시 필요
  extraReducers: (builder) => {
    builder.addCase(init.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.fcmToken = action.payload.fcmToken;
    }),
      builder.addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
      }),
      builder.addCase(logout.fulfilled, (state, action) => {
        state.user = null;
        state.token = null;
        state.fcmToken = null;
      }),
      builder.addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      }),
      builder.addCase(updateFCMToken.fulfilled, (state, action) => {
        state.fcmToken = action.payload.fcmToken;
      });
  },
});

export default authSlice;
