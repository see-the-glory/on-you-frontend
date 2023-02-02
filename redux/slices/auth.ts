import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../../api";

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

export const init = createAsyncThunk("auth/init", async (payload, thunkAPI) => {
  let token = null;
  let user = null;
  try {
    token = await AsyncStorage.getItem("token");
    user = await AsyncStorage.getItem("user");
    if (user) user = JSON.parse(user);
    else user = "";
  } catch (err) {
    console.log(err);
    return thunkAPI.rejectWithValue(payload);
  }
  return thunkAPI.fulfillWithValue({ user, token });
});

export const login = createAsyncThunk("auth/login", async (payload: { user: User; token: string }, thunkAPI) => {
  try {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    await AsyncStorage.setItem("token", payload.token);
    await AsyncStorage.setItem("user", JSON.stringify(payload.user));
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  // extraReducer는 비동기 액션 생성시 필요
  extraReducers: (builder) => {
    builder.addCase(init.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    }),
      builder.addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      }),
      builder.addCase(logout.fulfilled, (state, action) => {
        state.user = null;
        state.token = null;
      }),
      builder.addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  },
});

export default authSlice;
