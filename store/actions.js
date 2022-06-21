import AsyncStorage from "@react-native-async-storage/async-storage";

export const Init = () => {
  return async (dispatch) => {
    const token = await AsyncStorage.getItem("token");
    if (token !== null) {
      console.log("token fetched!");
      dispatch({
        type: "LOGIN",
        payload: token,
      });
    }
  };
};

export const Login = (token) => {
  return async (dispatch) => {
    await AsyncStorage.setItem("token", token);
    console.log(`Token stored : ${token}`);
    dispatch({
      type: "LOGIN",
      payload: token,
    });
  };
};

export const Logout = () => {
  return async (dispatch) => {
    await AsyncStorage.removeItem("token");
    dispatch({
      type: "LOGOUT",
    });
  };
};
