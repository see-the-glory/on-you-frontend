import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { DeviceEventEmitter } from "react-native";
import { API_BASE_URL, CHAT_BASE_URL } from "./properties";

export const apiAxios = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

apiAxios.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (config.headers && token) {
      config.headers.authorization = token ?? "";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiAxios.interceptors.response.use(
  (response) => ({ ...response.data, status: response.status }), // 2xx
  async (error) => {
    // 2xx 범위 밖
    if (error.response) {
      const status = error.response.status;
      if (status === 400) {
        if (!error.response.data) error.response.data = { message: "잘못된 요청입니다." };
      } else if (status === 401) {
        DeviceEventEmitter.emit("Logout", { isMultiUser: true });
      } else if (status === 500) {
        console.log(error.response.data);
        // toast.show(`${error?.response?.data?.error}`, { type: "warning" });
        // toast.show(`${error?.response?.data?.message}`, { type: "warning" });
        error.response.data = { message: "알 수 없는 오류" };
      }
      return Promise.reject({ ...error.response?.data, status, code: error.code });
    } else {
      console.log(error.response);
      // navigation.navigate("Parking");
      return Promise.reject({ message: "요청시간이 만료되었습니다.", code: error.code });
    }
  }
);

export const chatAxios = axios.create({
  baseURL: CHAT_BASE_URL,
  withCredentials: true,
  timeout: 5000,
});
