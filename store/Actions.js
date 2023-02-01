import AsyncStorage from "@react-native-async-storage/async-storage";

export const init = () => {
  return async (dispatch) => {
    const token = await AsyncStorage.getItem("token");
    const user = await AsyncStorage.getItem("user");
    if (token !== null) {
      console.log("token fetched!");
      dispatch({
        type: "LOGIN",
        payload: token,
      });
    }
    if (user !== null) {
      console.log("user data fetched!");
      dispatch({
        type: "UPDATE_USER",
        payload: JSON.parse(user),
      });
    }
  };
};

export const login = (token, user) => {
  return async (dispatch) => {
    console.log(`Token stored : ${token}`);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));
    dispatch({
      type: "LOGIN",
      payload: token,
    });
    dispatch({
      type: "UPDATE_USER",
      payload: user,
    });
  };
};

export const logout = () => {
  return async (dispatch) => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    dispatch({
      type: "DELETE_USER",
    });
    dispatch({
      type: "LOGOUT",
    });
  };
};

export const updateUser = (user) => {
  return async (dispatch) => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.setItem("user", JSON.stringify(user));
    dispatch({
      type: "UPDATE_USER",
      payload: user,
    });
  };
};

export const updateClubHomeScrollY = (y) => {
  return (dispatch) => {
    dispatch({
      type: "UPDATE_CLUBHOME_SCROLL_Y",
      payload: y,
    });
  };
};

export const updateClubHomeScheduleScrollX = (x) => {
  return (dispatch) => {
    dispatch({
      type: "UPDATE_CLUBHOME_SCHEDULE_SCROLL_X",
      payload: x,
    });
  };
};

export const deleteClub = () => {
  return (dispatch) => {
    dispatch({
      type: "DELETE_CLUB",
    });
  };
};
