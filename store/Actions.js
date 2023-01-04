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

export const updateUser = (user) => {
  return async (dispatch) => {
    await AsyncStorage.setItem("user", JSON.stringify(user));
    console.log(`User data stored`);
    console.log(user);
    dispatch({
      type: "UPDATE_USER",
      payload: user,
    });
  };
};

export const deleteUser = (user) => {
  return (dispatch) => {
    dispatch({
      type: "DELETE_USER",
      payload: user,
    });
  };
};

export const login = (token) => {
  return async (dispatch) => {
    await AsyncStorage.setItem("token", token);
    console.log(`Token stored : ${token}`);
    dispatch({
      type: "LOGIN",
      payload: token,
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
